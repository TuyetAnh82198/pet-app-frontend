import { useState, useEffect, useCallback } from "react";
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

import { socket } from "../socket.js";

const Edit = () => {
  //state danh sách pet, danh sách loại pet (chó, mèo), danh sách giống
  const [petList, setPetList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [breedList, setBreedList] = useState([]);
  //danh sách giống (breed) thú cưng hiển thị dựa trên loại (type)
  const [breedListForSelect, setBreedListForSelect] = useState([]);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [type, setType] = useState("Select Type");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [color, setColor] = useState("#000000");
  const [breed, setBreed] = useState("Select Breed");
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
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchPets(), [fetchPets]);

  //hàm cập nhật thông tin thú cưng
  const submitForm = (id) => {
    if (id !== "") {
      fetch(`${process.env.REACT_APP_BACKEND}/pets/update/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          weight: weight,
          length: length,
          age: age,
          //nhập id cho thuộc tính type vì type của PetModel tham chiếu đến TypeModel
          type: typeList.find((item) => item.petType === type)
            ? typeList.find((item) => item.petType === type)._id
            : "Select Type",
          color: color,
          breed: breedList.find((item) => item.petBreed === breed)
            ? breedList.find((item) => item.petBreed === breed)._id
            : "Select Breed",
          vac: vac,
          dew: dew,
          ste: ste,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Updated!") {
            alert("Updated!");
          } else if (data.err.length > 0) {
            alert(data.err[0]);
          }
        })
        .catch((err) => console.log(err));
    } else if (id === "") {
      alert("Please select pet to update!");
    }
  };

  //hàm lấy thông tin cụ thể của một thú cưng để dùng khi cập nhật
  let foundPetBreed;
  const petDetail = (id) => {
    const foundPet = petList.find((pet) => pet._id === id);
    foundPetBreed = breedList.find(
      (item) => item._id === foundPet.breed
    ).petBreed;
    // console.log(foundPetBreed);
    const founPetType = typeList.find(
      (item) => item._id === foundPet.type
    ).petType;
    // console.log(founPetType);
    // console.log(foundPet);
    setId(foundPet._id);
    setName(foundPet.name);
    setAge(foundPet.age);
    setBreed(foundPetBreed);
    setColor(foundPet.color);
    setDew(foundPet.dew);
    setLength(foundPet.length);
    setSte(foundPet.ste);
    setType(founPetType);
    setVac(foundPet.vac);
    setWeight(foundPet.weight);

    const newArr = breedList.filter((item) => item.petType === foundPet.type);
    setBreedListForSelect(newArr);
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

  return (
    <div>
      <Card className="rounded-1 border-0" style={{ backgroundColor: "#fff" }}>
        <Card.Header style={{}} as="h3" className="m-3">
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
              <Form.Control
                value={id}
                type="text"
                style={{ backgroundColor: "#cccccc" }}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="petNameAndAge">
            <Form.Label column sm="2">
              Pet Name
            </Form.Label>
            <Col sm="5">
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                defaultValue={name}
                type="text"
              />
            </Col>
            <Form.Label column sm="2">
              Age
            </Form.Label>
            <Col sm="3">
              <Form.Control
                onChange={(e) => setAge(e.target.value)}
                defaultValue={age}
                type="number"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="petType">
            <Form.Label column sm="2">
              Type
            </Form.Label>
            <Col sm="10">
              <Form.Select
                onChange={(e) => {
                  setType(e.target.value);
                  const idGotFromPetList = typeList.find(
                    (item) => item.petType === e.target.value
                  )
                    ? typeList.find((item) => item.petType === e.target.value)
                        ._id
                    : "";
                  const newArr = breedList.filter(
                    (item) => item.petType === idGotFromPetList
                  );
                  setBreed("Select Breed");
                  setBreedListForSelect(
                    newArr.filter((item) => item.petBreed !== foundPetBreed)
                  );
                }}
              >
                <option value={type}>{type}</option>
                {typeList
                  .filter((item) => item.petType !== type)
                  .map((type) => (
                    <option key={type._id} value={type.petType}>
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
                onChange={(e) => setWeight(e.target.value)}
                defaultValue={weight}
                type="number"
              />
            </Col>
            <Form.Label column sm="2">
              Length
            </Form.Label>
            <Col sm="3">
              <Form.Control
                onChange={(e) => setLength(e.target.value)}
                defaultValue={length}
                type="number"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="petColorAndBreed">
            <Form.Label column sm="2">
              Color
            </Form.Label>
            <Col sm="5">
              <Form.Control
                onChange={(e) => setColor(e.target.value)}
                defaultValue={color}
                type="color"
              />
            </Col>
            <Form.Label column sm="2">
              Breed
            </Form.Label>
            <Col sm="3">
              <Form.Select onChange={(e) => setBreed(e.target.value)}>
                {breedListForSelect
                  .filter((item) => item !== breed)
                  .sort((a, b) => a - b)
                  .map((breed) => (
                    <option key={breed._id} value={breed.petBreed}>
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
        <Form.Group className="col-md-10 col-lg-8 col-xl-7 col-xxl-6 d-flex">
          <Button onClick={() => submitForm(id)}>Submit</Button>
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
              <td>01/03/2022</td>
              <td>
                <Button
                  onClick={() => {
                    alert("Sample products cannot be edited");
                  }}
                  variant="warning"
                >
                  Edit
                </Button>
              </td>
            </tr>
            {petList.map((pet) => (
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
                    ? breedList.find((item) => item._id === pet.breed).petBreed
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

                <td>{moment(pet.date).format("DD/MM/YYYY")}</td>
                <td>
                  <Button onClick={() => petDetail(pet._id)} variant="warning">
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default Edit;
