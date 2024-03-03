import { useState, useEffect, useRef, useCallback } from "react";
import moment from "moment";
import {
  Card,
  Container,
  Form,
  Col,
  Row,
  Button,
  Table,
} from "react-bootstrap";
import { SquareFill, CheckCircleFill } from "react-bootstrap-icons";

import styles from "./home.module.css";

import { socket } from "../socket.js";

const Home = () => {
  //state danh sách pet, danh sách loại pet (chó, mèo), danh sách giống
  const [petList, setPetList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [breedList, setBreedList] = useState([]);
  //danh sách giống (breed) thú cưng hiển thị dựa trên loại (type)
  const [breedListForSelect, setBreedListForSelect] = useState([]);
  //state button Show Healthy Pet và Show All Pet
  const [btnHealthy, setBtnHealthy] = useState(false);
  //state danh sách thú cưng khỏe mạnh
  const [healthyPets, setHealthyPets] = useState([]);
  //state ẩn, hiện chỉ số BMI của thú cưng
  const [hideBMI, setHideBMI] = useState(true);

  const idInput = useRef();
  const nameInput = useRef();
  const typeInput = useRef();
  const weightInput = useRef();
  const lengthInput = useRef();
  const ageInput = useRef();
  const colorInput = useRef();
  const breedInput = useRef();
  const [vac, setVac] = useState(false);
  const [dew, setDew] = useState(false);
  const [ste, setSte] = useState(false);

  const fetchType = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/type/get`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.result);
        setTypeList(data.result);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchType(), [fetchType]);

  const fetchBreed = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/breed/get`)
      .then((response) => response.json())
      .then((data) => {
        setBreedList(data.result);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchBreed(), [fetchBreed]);

  const fetchPets = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/pets/get`)
      .then((response) => response.json())
      .then((data) => {
        setPetList(data.result);
        // console.log(
        //   typeList.find((item) => item._id === data.result[0].type).petType
        // );
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchPets(), [fetchPets]);

  //hàm thêm thú cưng và cập nhật lại danh sách thú cưng
  const submitForm = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/pets/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: idInput.current.value,
        name: nameInput.current.value,
        weight: weightInput.current.value,
        length: lengthInput.current.value,
        age: ageInput.current.value,
        //nhập id cho thuộc tính type vì type của PetModel tham chiếu đến TypeModel
        type: typeList.find((item) => item.petType === typeInput.current.value)
          ? typeList.find((item) => item.petType === typeInput.current.value)
              ._id
          : "Select Type",
        color: colorInput.current.value,
        breed: breedList.find(
          (item) => item.petBreed === breedInput.current.value
        )
          ? breedList.find((item) => item.petBreed === breedInput.current.value)
              ._id
          : "Select Breed",
        vac: vac,
        dew: dew,
        ste: ste,
        date: new Date(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Added!") {
          alert("Added!");
          // console.log(data.result);
        } else if (data.message === "ID must be unique!") {
          alert("ID must be unique!");
        } else if (data.err.length > 0) {
          alert(data.err[0]);
        }
      })
      .catch((err) => console.log(err));
  };

  //hàm xóa thú cưng và cập nhật lại danh sách thú cưng
  const deletePet = (id) => {
    const isDeleted = window.confirm("Are you sure?");
    if (isDeleted) {
      fetch(`${process.env.REACT_APP_BACKEND}/pets/delete/${id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Deleted!") {
            alert("Deleted!");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  //Hàm cho button chọn hiển thị danh sách thú cưng khỏe mạnh hoặc toàn bộ thú cưng
  const toggleBtnShowHealthyPet = () => {
    setBtnHealthy(!btnHealthy);
    // console.log(btnHealthy);
    if (!btnHealthy) {
      const healthyPetsArr = petList.filter((pet) => {
        return pet.vac && pet.dew && pet.ste;
      });
      setHealthyPets(healthyPetsArr);
      // console.log(healthyPetsArr);
    }
  };

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const petFunction = (data) => {
      if (data.action === "add") {
        setPetList(data.addResult);
      } else if (data.action === "delete") {
        setPetList(data.deleteResult);
      } else if (data.action === "update") {
        setPetList(data.updateResult);
      }
    };
    socket.on("pets", petFunction);
    return () => {
      socket.off("pets", petFunction);
    };
  }, []);

  //hàm xuất file json
  const exportData = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/export/pets`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "petsdata.json");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((err) => {
        console.log(err);
        alert("Error");
      });
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <Card className="rounded-1 border-0" style={{ backgroundColor: "#fff" }}>
        <Card.Header as="h3" className="m-3">
          Pet Management
        </Card.Header>
      </Card>
      <Container className="mt-5" style={{ width: "60%" }}>
        <Form>
          <Form.Group as={Row} className="mb-3" controlId="petID">
            <Form.Label column sm="2">
              Pet ID
            </Form.Label>
            <Col sm="10">
              <Form.Control ref={idInput} type="text" placeholder="Input ID" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="petNameAndAge">
            <Form.Label column sm="2">
              Pet Name
            </Form.Label>
            <Col sm="5">
              <Form.Control
                ref={nameInput}
                type="text"
                placeholder="Input Name"
              />
            </Col>
            <Form.Label column sm="2">
              Age
            </Form.Label>
            <Col sm="3">
              <Form.Control
                ref={ageInput}
                type="number"
                placeholder="Input Age"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="petType">
            <Form.Label column sm="2">
              Type
            </Form.Label>
            <Col sm="10">
              <Form.Select
                ref={typeInput}
                onChange={() => {
                  const idGotFromPetList = typeList.find(
                    (item) => item.petType === typeInput.current.value
                  )
                    ? typeList.find(
                        (item) => item.petType === typeInput.current.value
                      )._id
                    : "";
                  const newArr = breedList.filter(
                    (item) => item.petType === idGotFromPetList
                  );
                  setBreedListForSelect(newArr);
                }}
              >
                <option defaultValue="Select Type">Select Type</option>
                {typeList.map((type) => (
                  <option key={type._id} defaultValue={type.petType}>
                    {type.petType}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="petWeightAndLength">
            <Form.Label column sm="2">
              Weight
            </Form.Label>
            <Col sm="5">
              <Form.Control
                ref={weightInput}
                type="number"
                placeholder="Input Weight"
              />
            </Col>
            <Form.Label column sm="2">
              Length
            </Form.Label>
            <Col sm="3">
              <Form.Control
                ref={lengthInput}
                type="number"
                placeholder="Input Length"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="petColorAndBreed">
            <Form.Label column sm="2">
              Color
            </Form.Label>
            <Col sm="5">
              <Form.Control
                defaultValue="#000000"
                ref={colorInput}
                type="color"
              />
            </Col>
            <Form.Label column sm="2">
              Breed
            </Form.Label>
            <Col sm="3">
              <Form.Select ref={breedInput}>
                <option defaultValue="Select Breed">Select Breed</option>
                {breedListForSelect.map((breed) => (
                  <option key={breed._id} defaultValue={breed.petBreed}>
                    {breed.petBreed}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Form.Group>
          <Form.Group className="text-center">
            <div className="mb-3">
              <Form.Check
                inline
                label="Vaccinated"
                type="checkbox"
                id="vaccinated"
                checked={vac}
                onChange={() => setVac(!vac)}
              />
              <Form.Check
                inline
                label="Dewormed"
                type="checkbox"
                id="dewormed"
                checked={dew}
                onChange={() => setDew(!dew)}
              />
              <Form.Check
                inline
                label="Sterilized"
                type="checkbox"
                id="sterilized"
                checked={ste}
                onChange={() => setSte(!ste)}
              />
            </div>
          </Form.Group>
        </Form>
        <Form.Group className="col-md-10 col-lg-8 col-xl-7 col-xxl-6 d-flex justify-content-around">
          <Button onClick={submitForm}>Submit</Button>
          <Button
            onClick={toggleBtnShowHealthyPet}
            className={`btn-warning ${styles.btnShowHealthyPet}`}
          >
            {btnHealthy ? "Show All Pet" : "Show Healthy Pet"}
          </Button>
          <Button
            onClick={() => {
              setHideBMI(!hideBMI);
            }}
            className="btn-warning"
          >
            Calculate BMI
          </Button>
        </Form.Group>
      </Container>
      <Container className="mt-4" style={{ width: "90%" }}>
        <Table responsive striped hover>
          <thead className="border-bottom border-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Type</th>
              <th>Weight</th>
              <th>Length</th>
              <th>Breed</th>
              <th>Color</th>
              <th>Vaccinated</th>
              <th>Dewormed</th>
              <th>Sterilized</th>
              <th>BMI</th>
              <th>Date Added</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="tbody">
            <tr>
              <td style={{ fontWeight: "bold" }}>P001</td>
              <td>Tom</td>
              <td>3</td>
              <td>Cat</td>
              <td>5 kg</td>
              <td>50 cm</td>
              <td>Tabby</td>
              <td>
                <SquareFill style={{ color: "red" }} />
              </td>
              <td>
                <CheckCircleFill style={{ color: "green" }} />
              </td>
              <td>
                <CheckCircleFill style={{ color: "green" }} />
              </td>
              <td>
                <CheckCircleFill style={{ color: "green" }} />
              </td>
              <td>{hideBMI ? "?" : ((5 * 886) / 50 ** 2).toFixed(2)}</td>
              <td>01/03/2022</td>
              <td>
                <Button
                  onClick={() => {
                    alert("The sample pet cannot be deleted");
                  }}
                  variant="danger"
                >
                  Delete
                </Button>
              </td>
            </tr>
            {!btnHealthy &&
              petList.map((pet) => (
                <tr key={pet._id} id={pet._id}>
                  <td style={{ fontWeight: "bold" }}>{pet._id}</td>
                  <td>{pet.name}</td>
                  <td>{pet.age}</td>
                  <td>
                    {typeList.find((item) => item._id === pet.type)
                      ? typeList.find((item) => item._id === pet.type).petType
                      : ""}
                  </td>
                  <td>{pet.weight} kg</td>
                  <td>{pet.length} cm</td>
                  <td>
                    {breedList.find((item) => item._id === pet.breed)
                      ? breedList.find((item) => item._id === pet.breed)
                          .petBreed
                      : ""}
                  </td>
                  <td>
                    <SquareFill style={{ color: `${pet.color}` }} />
                  </td>
                  <td>
                    {pet.vac ? (
                      <CheckCircleFill style={{ color: "green" }} />
                    ) : (
                      <CheckCircleFill style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {pet.dew ? (
                      <CheckCircleFill style={{ color: "green" }} />
                    ) : (
                      <CheckCircleFill style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {pet.ste ? (
                      <CheckCircleFill style={{ color: "green" }} />
                    ) : (
                      <CheckCircleFill style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {hideBMI
                      ? "?"
                      : pet.type === "652aaeebd6e41794d68ab3b2"
                      ? ((pet.weight * 703) / pet.length ** 2).toFixed(2)
                      : ((pet.weight * 886) / pet.length ** 2).toFixed(2)}
                  </td>
                  <td>{moment(pet.date).format("DD/MM/YYYY")}</td>
                  <td>
                    <Button onClick={() => deletePet(pet._id)} variant="danger">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            {btnHealthy &&
              healthyPets.map((pet) => (
                <tr key={pet._id} id={pet._id}>
                  <td style={{ fontWeight: "bold" }}>{pet._id}</td>
                  <td>{pet.name}</td>
                  <td>{pet.age}</td>
                  <td>
                    {typeList.find((item) => item._id === pet.type)
                      ? typeList.find((item) => item._id === pet.type).petType
                      : ""}
                  </td>
                  <td>{pet.weight} kg</td>
                  <td>{pet.length} cm</td>
                  <td>
                    {breedList.find((item) => item._id === pet.breed)
                      ? breedList.find((item) => item._id === pet.breed)
                          .petBreed
                      : ""}
                  </td>
                  <td>
                    <SquareFill style={{ color: `${pet.color}` }} />
                  </td>
                  <td>
                    {pet.vac ? (
                      <CheckCircleFill style={{ color: "green" }} />
                    ) : (
                      <CheckCircleFill style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {pet.dew ? (
                      <CheckCircleFill style={{ color: "green" }} />
                    ) : (
                      <CheckCircleFill style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {pet.ste ? (
                      <CheckCircleFill style={{ color: "green" }} />
                    ) : (
                      <CheckCircleFill style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {hideBMI
                      ? "?"
                      : pet.type === "652aaeebd6e41794d68ab3b2"
                      ? ((pet.weight * 703) / pet.length ** 2).toFixed(2)
                      : ((pet.weight * 886) / pet.length ** 2).toFixed(2)}
                  </td>
                  <td>{moment(pet.date).format("DD/MM/YYYY")}</td>
                  <td>
                    <Button onClick={() => deletePet(pet._id)} variant="danger">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        <div className="px-2 py-1" style={{ textAlign: "right" }}>
          <Button onClick={exportData}>Export data</Button>
        </div>
      </Container>
    </div>
  );
};

export default Home;
