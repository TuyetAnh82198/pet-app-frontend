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

const Search = () => {
  //state danh sách pet, danh sách loại pet (chó, mèo), danh sách giống
  const [petList, setPetList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [breedList, setBreedList] = useState([]);

  //state danh sách giống (breed) thú cưng hiển thị dựa theo loại (type) thú cưng
  const [breedListForSelect, setBreedListForSelect] = useState([]);
  //state danh sách thú cưng hiển thị dựa theo điều kiện tìm kiếm
  const [foudnPetList, setFoundPetList] = useState([]);

  const idInput = useRef();
  const nameInput = useRef();
  const breedInput = useRef();
  const typeInput = useRef();
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
        setFoundPetList(data.result);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchPets(), [fetchPets]);

  //hàm tìm kiếm thú cưng
  const submitForm = () => {
    let newArr = [];
    if (idInput.current.value.trim().length !== 0) {
      newArr = petList.filter((pet) =>
        pet._id.toLowerCase().includes(idInput.current.value.toLowerCase())
      );
    }
    if (nameInput.current.value.trim().length !== 0) {
      newArr = petList.filter((pet) =>
        pet.name.toLowerCase().includes(nameInput.current.value.toLowerCase())
      );
    }
    if (typeInput.current.value !== "Select Type") {
      newArr = petList.filter(
        (pet) =>
          pet.type ===
          typeList.find((item) => item.petType === typeInput.current.value)._id
      );
    }
    if (breedInput.current.value !== "Select Breed") {
      newArr = petList.filter(
        (pet) =>
          pet.type ===
          breedList.find((item) => item.petBreed === breedInput.current.value)
            ._id
      );
    }
    newArr = newArr.filter(
      (pet) => pet.vac === vac && pet.dew === dew && pet.ste === ste
    );
    setFoundPetList(newArr);
    // console.log(newArr);
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
            window.location.reload();
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div>
      <Card className="rounded-1 border-0" style={{ backgroundColor: "#fff" }}>
        <Card.Header style={{}} as="h3" className="m-3">
          Search Pet
        </Card.Header>
      </Card>
      <Container className="mt-5" style={{ width: "60%" }}>
        <Form>
          <Form.Group as={Row} className="mb-3" controlId="petIdAndName">
            <Form.Label column sm="2">
              Pet ID
            </Form.Label>
            <Col sm="3">
              <Form.Control ref={idInput} type="text" placeholder="Input ID" />
            </Col>
            <Form.Label column sm="2">
              Pet Name
            </Form.Label>
            <Col sm="4">
              <Form.Control
                ref={nameInput}
                type="text"
                placeholder="Input Name"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="petTypeAndBreed">
            <Form.Label column sm="2">
              Type
            </Form.Label>
            <Col sm="3">
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
            <Form.Label column sm="2">
              Breed
            </Form.Label>
            <Col sm="4">
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
          <Form.Group>
            <Button onClick={submitForm}>Find</Button>
            <span style={{ marginLeft: "1rem" }}>
              <i>(Search results do not include the sample pet)</i>
            </span>
          </Form.Group>
        </Form>
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
            {foudnPetList.map((pet) => (
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
                  <Button onClick={() => deletePet(pet._id)} variant="danger">
                    Delete
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

export default Search;
