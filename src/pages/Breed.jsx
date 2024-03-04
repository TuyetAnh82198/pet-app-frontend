import { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  Container,
  Form,
  Row,
  Col,
  Button,
  Table,
} from "react-bootstrap";

import { socket } from "../socket.js";

const Breed = () => {
  //state danh sách loại pet (chó, mèo), danh sách giống
  const [typeList, setTypeList] = useState([]);
  const [breedList, setBreedList] = useState([]);

  const breedInput = useRef();
  const typeInput = useRef();

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

  //hàm thêm Breed và cập nhật danh sách Breed
  const submitForm = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/breed/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        petBreed: breedInput.current.value,
        //nhập id cho thuộc tính petType vì type của PetModel tham chiếu đến TypeModel
        petType: typeList.find(
          (item) => item.petType === typeInput.current.value
        )
          ? typeList.find((item) => item.petType === typeInput.current.value)
              ._id
          : "Select Type",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Added!") {
          alert("Added!");
          breedInput.current.value = "";
          // console.log(data.result);
        } else if (data.message === "Breed must be unique!") {
          alert("Breed must be unique!");
        } else if (data.err.length > 0) {
          alert(data.err[0]);
        }
      })
      .catch((err) => console.log(err));
  };

  // //hàm xóa breed và cập nhật lại danh sách breed
  // const deleteBreed = (id) => {
  //   const isDeleted = window.confirm("Are you sure?");
  //   if (isDeleted) {
  //     fetch(`${process.env.REACT_APP_BACKEND}/breed/delete/${id}`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         if (data.message === "Deleted!") {
  //           alert("Deleted!");
  //         }
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // };

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const petFunction = (data) => {
      if (data.action === "add") {
        setBreedList(data.addResult);
      } else if (data.action === "delete") {
        setBreedList(data.deleteResult);
      }
    };
    socket.on("breeds", petFunction);
    return () => {
      socket.off("breeds", petFunction);
    };
  }, []);

  return (
    <div>
      <Card className="rounded-1 border-0" style={{ backgroundColor: "#fff" }}>
        <Card.Header style={{}} as="h3" className="m-3">
          Breed Management
        </Card.Header>
      </Card>
      <Container className="mt-5" style={{ width: "60%" }}>
        <Form>
          <Form.Group as={Row} className="mb-3" controlId="petBreed">
            <Form.Label column sm="2">
              Breed
            </Form.Label>
            <Col sm="10">
              <Form.Control
                ref={breedInput}
                type="text"
                placeholder="Input Breed"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="petType">
            <Form.Label column sm="2">
              Type
            </Form.Label>
            <Col sm="10">
              <Form.Select ref={typeInput}>
                <option defaultValue="Select Type">Select Type</option>
                {typeList.map((type) => (
                  <option key={type._id} defaultValue={type.petType}>
                    {type.petType}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Form.Group>
          <Form.Group>
            <Button onClick={submitForm}>Submit</Button>
          </Form.Group>
        </Form>
      </Container>
      <Container className="mt-4" style={{ width: "90%" }}>
        <Table responsive striped hover>
          <thead className="border-bottom border-dark">
            <tr>
              <th className="col-1">#</th>
              <th className="col-5">Breed</th>
              <th className="col-3">Type</th>
              <th className="col-3">Action</th>
            </tr>
          </thead>
          <tbody id="tbody">
            {breedList.map((item, i) => (
              <tr key={item._id}>
                <td>{i}</td>
                <td>{item.petBreed}</td>
                <td>
                  {typeList.find((type) => type._id === item.petType)
                    ? typeList.find((type) => type._id === item.petType).petType
                    : ""}
                </td>
{/*                 <td>
                  <Button
                    onClick={() => deleteBreed(item._id)}
                    variant="danger"
                  >
                    Delete
                  </Button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default Breed;
