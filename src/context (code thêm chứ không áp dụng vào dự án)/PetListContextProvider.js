import { useReducer } from "react";

import PetListContext from "./PetListContext.js";

const PetListContextProvider = (props) => {
  //tạo state ban đầu gồm danh sách pet, danh sách loại pet, danh sách giống
  const initialState = {
    petList: [
      {
        id: "P002",
        name: "Tyke",
        age: "5",
        type: "Dog",
        weight: "3",
        length: "40",
        breed: "Mixed Breed",
        color: "orange",
        vac: false,
        dew: false,
        ste: false,
        date: new Date("02-03-2022"),
      },
    ],
    typeList: ["Cat", "Dog"],
    breedList: ["Tabby", "Mixed Breed"],
  };

  const reducer = (state, action) => {
    //thêm pet vào mảng petList của đối tượng initialState
    if (action.type === "ADD") {
      const newArr = [...state.petList, action.pet];
      return {
        petList: newArr,
        typeList: state.typeList,
        breedList: state.breedList,
      };
    } else if (action.type === "REMOVE") {
      //xóa pet ra khỏi mảng petList
      const petIndex = state.petList.findIndex((pet) => pet.id === action.id);
      state.petList.splice(petIndex, 1);
      return {
        petList: [...state.petList],
        typeList: state.typeList,
        breedList: state.breedList,
      };
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const value = {
    petList: state.petList,
    typeList: state.typeList,
    breedList: state.breedList,
    add(pet) {
      dispatch({ type: "ADD", pet: pet });
    },
    remove(id) {
      dispatch({ type: "REMOVE", id: id });
    },
  };

  return (
    <PetListContext.Provider value={value}>
      {props.children}
    </PetListContext.Provider>
  );
};

export default PetListContextProvider;
