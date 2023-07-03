import "./StudentManager.scss";
import React, { Fragment, useEffect, useState, useRef } from "react";
import {Buffer} from 'buffer'
import { FiEdit } from "react-icons/fi";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { BsEyeSlash } from "react-icons/bs";
import { IoMdEye } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { BsPersonPlusFill } from "react-icons/bs";
import { useContext } from "react";
import { ContextScrollTop } from "../RootSystem";
import {HiOutlinePencilAlt} from 'react-icons/hi'

import {
  createUserApi,
  deleteUserApi,
  getAllCodeApi,
  getUserApi,
  updateUserApi,
} from "../../../services/userService";
import { emitter } from "../../../utils/emitter";
import Loading from "./../../../utils/Loading";
import DeleteModal from "./../Modal/DeleteModal";
import convertFileToBase64 from "../../../utils/convertFileToBase64";
import convertBufferToBase64 from '../../../utils/convertBufferToBase64';

const StudentManager = () => {
  // const [isCreateUser, setIsCreateUser] = useState(false);
  const [isDeleteUser, setIsDeleteUser] = useState(false);
  const [dataUserDelete, setDataUserDelete] = useState("");
  const [isUpdateUser, setIsUpdateUser] = useState(false);
  const [dataUserUpdate, setDataUserUpdate] = useState("");

  const [users, setUsers] = useState([]);
  const [eye, setEye] = useState(false);
  const [loading, setLoading] = useState(false);
  const [genderAPI, setGenderAPI] = useState([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatar, setAvatar] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [notifyCheckState, setNotifyCheckState] = useState("");
  const [previewAvatar, setPreviewAvatar] = useState("");

  //scroll top
  const scroll = useContext(ContextScrollTop);
  //ref
  const inputFileRef = useRef();
  useEffect(() => {
    setLoading(true);
    const gender = "GENDER";
    setTimeout(async () => {
      await getAllCodeApi.getByType({ type: gender }).then((data) => {
        if (data?.codeNumber === 0) {
          setGenderAPI(data.allCode);
        }
      });

      await getUserApi.getUserByRole({ role: "R3" }).then((data) => {
        if (data?.codeNumber === 0) {
          setUsers(data.user);
        }
      });
      setLoading(false);
      scroll?.isScroll();
    }, 1500);
  }, []);

  const handleChangeEvent = (value, type) => {
    const stateArr = [
      "Email",
      "Password",
      "FullName",
      "PhoneNumber",
      "Address",
      "Gender",
    ];
    const setStateArr = [
      setEmail,
      setPassword,
      setFullName,
      setPhoneNumber,
      setAddress,
      setGender,
    ];
    for (let i = 0; i < stateArr.length; i++) {
      if (type === stateArr[i]) {
        setStateArr[i](value);
        break;
      } else {
        continue;
      }
    }
  };

  const handleChangeAndPreviewImage = async (e) => {
    let data = e.target.files;
    let file = data[0];
    if (file) {
      let urlAvatar = URL.createObjectURL(file);
      setPreviewAvatar(urlAvatar);
      try {
        const base64File = await convertFileToBase64(file);
        setAvatar(base64File);
      } catch (e) {
        console.log("base64 file " + e);
      }
    }
  };

  const handleCheckNullState = () => {
    let result = true;
    const stateArr = [
      email,
      password,
      fullName,
      phoneNumber,
      address,
      gender,
    ];
    const notification = [
      "Email",
      "Password",
      "FullName",
      "PhoneNumber",
      "Address",
      "Gender",
    ];
    for (let i = 0; i < stateArr.length; i++) {
      if (!stateArr[i]) {
        setNotifyCheckState(`${notification[i]} is required`);
        result = false;
        break;
      } else {
        setNotifyCheckState("");
      }
    }
    return result;
  };

  const handleCheckValidate = () => {
    let result = true;
    const checkNullState = handleCheckNullState();
    if (checkNullState) {
      const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const regexPassword =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      const rejexPhoneNumber = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
      const regexName = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
      if (!regexEmail.test(email)) {
        setNotifyCheckState("Please enter right form of email");
        return false;
      }
      if (!regexPassword.test(password)) {
        setNotifyCheckState(
          `Password must to have minimum eight characters, at least one letter, one number and one special character`
        );
        return false;
      }
      if (!regexName.test(fullName)) {
        setNotifyCheckState(
          "Please enter right form of full name. VD: Bui Van A"
        );
        return false;
      }
      if (!rejexPhoneNumber.test(phoneNumber)) {
        setNotifyCheckState("Please enter right form of phone number");
        return false;
      }

      return result;
    }
  };

  const handleCreateNewUser = async () => {
    if (handleCheckValidate()) {
      const body = {
        email,
        password,
        fullName,
        phoneNumber,
        roleId: "R3",
        address,
        gender,
        image: avatar,
      };
      createUserApi.create({}, body).then(async (data) => {
        if (data?.codeNumber === 1) {
          toast.error(data?.message, {
            autoClose: 2000,
          });
        } else {
          await getUserApi.getUserByRole({ role: "R3" }).then((data) => {
            if (data?.codeNumber === 0) {
              setUsers(data.user);
            }
          });
          //     //clear data modal
          //     emitter.emit("CLEAR_DATA_MODAL");
          //   }
          // });
          toast.success("Create a new user succeed", {
            autoClose: 2000,
          });
          setEmail("");
          setPassword("");
          setFullName("");
          setPhoneNumber("");
          setAddress("");
          setGender("");
          setAvatar("");
          setPreviewAvatar("");
          inputFileRef.current.value = "";
        }
      });
    }
  };

  // const isCloseCreateUserModal = () => {
  //   setIsCreateUser(false);
  // };

  // const isOpenModalUpdateUser = (user) => {
  //   setIsUpdateUser(true);
  //   setDataUserUpdate(user)
  // }
  // const isCloseUpdateUserModal = () => {
  //   setIsUpdateUser(false);
  // }

  // const createNewUser = async (body) => {
  //   createUserApi.create({}, body).then((data) => {
  //     if (data?.codeNumber === 1) {
  //       toast.error(data?.message, {
  //         autoClose: 2000,
  //       });
  //     } else {
  //       getUserApi.getAllUsers({ id: "All" }).then((data) => {
  //         if (data?.codeNumber === 0) {
  //           setUsers(data?.user);
  //           setIsCreateUser(false);
  //           toast.success("Create a new user succeed", {
  //             autoClose: 2000,
  //           });

  //           //clear data modal
  //           emitter.emit("CLEAR_DATA_MODAL");
  //         }
  //       });
  //     }
  //   });
  // };

  // const updateUser = async(body) => {
  //   updateUserApi.update({}, body).then((data) => {
  //     if (data?.codeNumber === 1) {
  //       toast.error(data?.message, {
  //         autoClose: 2000,
  //       });
  //     } else {
  //       getUserApi.getAllUsers({ id: "All" }).then((data) => {
  //         if (data?.codeNumber === 0) {
  //           setUsers(data?.user);
  //           setIsUpdateUser(false);
  //           toast.success("Update user succeed", {
  //             autoClose: 2000,
  //           });
  //         }
  //       });
  //     }
  //   })
  // }

  //update user
  const isOpenUpdateUser = async (user) => {
    setLoading(true);
    setDataUserUpdate(user);
    let base64File = "";
    if (user?.image?.data) {
       base64File = new Buffer(user.image.data, 'base64').toString('binary');
    }
    setTimeout(async () => {
      setEmail(user?.email);
      setPassword("permitUpdate1@");
      setFullName(user?.fullName);
      setPhoneNumber(user?.phoneNumber);
      setAddress(user?.address);
      setGender(user?.gender);
      setLoading(false);
      setIsUpdateUser(true);
      if (base64File) {
        setPreviewAvatar(base64File);
      } else {
        setPreviewAvatar("");
      }
    }, 0);
  };

  const handleUpdateUser = () => {
    setLoading(true);
    const body = {
      id: dataUserUpdate?.id,
      fullName,
      phoneNumber,
      gender,
      address,
      image: avatar
    };
    setTimeout(() => {
        updateUserApi.update({}, body).then(async (data) => {
          if (data?.codeNumber === 1) {
            toast.error(data?.message, {
              autoClose: 2000,
            });
          } else {
            await getUserApi.getUserByRole({ role: "R3" }).then((data) => {
              if (data?.codeNumber === 0) {
                setUsers(data.user);
              }
            });
            toast.success("Update user succeed", {
              autoClose: 2000,
            });
            setEmail("");
            setPassword("");
            setFullName("");
            setPhoneNumber("");
            setAddress("");
            setGender("");
            setIsUpdateUser(false);
            setDataUserUpdate("");
            setPreviewAvatar("");
            inputFileRef.current.value = "";
            setAvatar("");
            setLoading(false)
          }
        });
    }, 2000)
  };

  const handleCloseUpdateUser = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setPhoneNumber("");
    setAddress("");
    setGender("");
    setAvatar("");
    setPreviewAvatar("");
    setIsUpdateUser(false);
    setDataUserUpdate("");
    inputFileRef.current.value = "";
  }

  //delete user
  const isCloseDeleteUserModal = () => {
    setIsDeleteUser(false);
  };
  const isOpenModalDeleteUser = (user) => {
    setIsDeleteUser(true);
    setDataUserDelete(user);
  };
  const deleteUser = async (id) => {
    setLoading(true);
    setTimeout(() => {
      deleteUserApi.delete({ id }).then((data) => {
        if (data?.codeNumber === 1) {
          toast.error(data?.message, {
            autoClose: 2000,
          });
        } else {
          getUserApi.getUserByRole({ role: "R3" }).then((data) => {
            if (data?.codeNumber === 0) {
              setUsers(data.user);
              setLoading(false);
              setDataUserDelete("")
              setIsDeleteUser(false);
              toast.success("Delete user succeed", {
                autoClose: 2000,
              });
            }
          });
        }
      });
    }, 1000);
  };

  return (
    <Fragment>
      <ToastContainer />
      <div
        className="mt-3 flex flex-col mx-auto pb-10"
        style={{ maxWidth: "80%", width: "80%" }}
      >
        <p className="mx-auto text-2xl text-blue-600 font-semibold">
          STUDENT MANAGER
        </p>

        <div
          className={`flex items-center justify-center mt-3 py-2 px-1 text-white font-semibold rounded-md  ${
            isUpdateUser ? "bg-backColor" : "bg-blue-700"
          }`}
          // type="text"
          // onClick={() => setIsCreateUser(true)}
          style={{ maxWidth: "14%", width: "14%" }}
        >
          <BsPersonPlusFill
            className="mr-1"
            style={{ fontSize: "16px" }}
            modal
          />
          {isUpdateUser ? "Update Student" : "Create a new student"}
        </div>
        {loading && <Loading />}
        <div className="flex overflow-hidden flex-col h-auto bg-slate-200 rounded-lg shadow backdrop-blur-md shadow-gray-300 mt-2 mb-1">
          <div className="pt-1 pb-4 px-3 flex flex-col justify-center-center w-full">
            <span
              className="mx-auto text-red-500 mb-2"
              style={notifyCheckState ? { opacity: "1" } : { opacity: "0" }}
            >
              {notifyCheckState ? notifyCheckState : "Null"}
            </span>
            <div className="w-full flex items-center justify-center gap-6">
              <div className="flex-1 flex flex-col justify-center">
                <label htmlFor="email" className="mb-1 text-headingColor opacity-80 flex items-center gap-1">Email <HiOutlinePencilAlt /></label>
                <input
                  className={`shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light 
                  ${isUpdateUser ? "bg-blurColor opacity-30" : ""}`}
                  name="email"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => handleChangeEvent(e.target.value, "Email")}
                  onFocus={() => setNotifyCheckState("")}
                  required
                  disabled={isUpdateUser ? true : false}
                />
              </div>
              <div className="flex-1 flex flex-col justify-center relative">
                <label htmlFor="password" className="mb-1 text-headingColor opacity-80 flex items-center gap-1">Password <HiOutlinePencilAlt /></label>
                <input
                  className={`shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light 
                  ${isUpdateUser ? "bg-blurColor opacity-30" : ""}`}
                  name="password"
                  id="password"
                  type={`${eye ? "text" : "password"}`}
                  value={password}
                  onChange={(e) =>
                    handleChangeEvent(e.target.value, "Password")
                  }
                  onFocus={() => setNotifyCheckState("")}
                  disabled={isUpdateUser ? true : false}
                />
                {eye ? (
                  <IoMdEye
                    className="absolute right-2 bottom-3 cursor-pointer"
                    onClick={() => setEye(false)}
                  />
                ) : (
                  <BsEyeSlash
                    className="absolute right-2 bottom-3 cursor-pointer"
                    onClick={() => setEye(true)}
                  />
                )}
              </div>
            </div>

            <div className="w-full flex items-center justify-center gap-6 mt-3">
              <div className="flex-1 flex flex-col justify-center">
                <label htmlFor="name" className="mb-1 text-headingColor opacity-80 flex items-center gap-1">FullName <HiOutlinePencilAlt /></label>
                <input
                  className="shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  name="name"
                  id="name"
                  type="text"
                  value={fullName}
                  onChange={(e) =>
                    handleChangeEvent(e.target.value, "FullName")
                  }
                  onFocus={() => setNotifyCheckState("")}
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <label htmlFor="phone" className="mb-1 text-headingColor opacity-80 flex items-center gap-1">
                  PhoneNumber <HiOutlinePencilAlt />
                </label>
                <input
                  className=" shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  name="phone"
                  id="phone"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) =>
                    handleChangeEvent(e.target.value, "PhoneNumber")
                  }
                  onFocus={() => setNotifyCheckState("")}
                />
              </div>
            </div>

            <div className="w-full flex items-center justify-center gap-6 mt-3">
              <div className="flex flex-col justify-center flex-1">
                <label htmlFor="address" className="mb-1 text-headingColor opacity-80 flex items-center gap-1">Address <HiOutlinePencilAlt /></label>
                <input
                  className=" shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  name="address"
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => handleChangeEvent(e.target.value, "Address")}
                  onFocus={() => setNotifyCheckState("")}
                />
              </div>
            </div>

            <div className="w-full flex items-center justify-center gap-6 mt-3">
              <div className="flex-1 flex flex-col justify-center">
                <label htmlFor="gender" className="mb-1 text-headingColor opacity-80 flex items-center gap-1">Gender <HiOutlinePencilAlt /></label>
                <select
                  className=" shadow-sm bg-gray-50 border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  name="gender"
                  type="text"
                  id="gender"
                  value={gender}
                  onChange={(e) => handleChangeEvent(e.target.value, "Gender")}
                  onFocus={() => setNotifyCheckState("")}
                >
                  <option name="gender" value="">
                    Select---
                  </option>
                  {genderAPI?.length > 0 &&
                    genderAPI?.map((e, i) => {
                      return (
                        <option key={i} name="role" value={e?.keyMap}>
                          {e?.valueVn}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="flex-1 flex-col justify-center flex">
                <label className="mb-1 text-headingColor opacity-80 flex items-center gap-1" htmlFor="file_input">
                  Avatar
                </label>
                <input
                  className="block w-full text-sm text-gray-900 border border-gray-400 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="file_input"
                  type="file"
                  onChange={(e) => handleChangeAndPreviewImage(e)}
                  onFocus={() => setNotifyCheckState("")}
                  ref={inputFileRef}
                />
              </div>
            </div>

            <div className="w-full flex item-center justify-start mt-3 gap-6">
              <span className="text-red-500 font-semibold flex-1 flex items-center gap-1">
                All Field have <HiOutlinePencilAlt /> is required
              </span>
              {previewAvatar && (
                <div className="w-full h-24 flex-1">
                  <div
                    style={{
                      backgroundImage: `url(${previewAvatar})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "contain",
                      height: "100%",
                      width: "50%",
                      cursor: "pointer",
                    }}
                  ></div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-5">
              <button
                className={`${
                  isUpdateUser ? "bg-backColor" : "bg-blue-600"
                } text-white mt-6 py-2 px-1 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-80 hover:bg-opacity-100`}
                style={{ maxWidth: "15%", width: "15%" }}
                onClick={
                  isUpdateUser
                    ? () => handleUpdateUser()
                    : () => handleCreateNewUser()
                }
              >
                {isUpdateUser ? "Save Changes" : "Add new"}
              </button>
             {
              isUpdateUser && (
                <button
                className={` text-white mt-6 py-2 px-1 font-semibold rounded-md shadow backdrop-blur-md bg-opacity-80 hover:bg-opacity-100 bg-blue-600`}
                style={{ maxWidth: "10%", width: "10%" }}
                onClick={() => handleCloseUpdateUser()}
              >
                Close
              </button>
              )
             }
            </div>
          </div>

          {/* <RiDeleteBack2Fill
            className="absolute top-2 right-2 text-white text-xl cursor-pointer" */}
            {/* // onClick={() => isClose()} */}
          {/* /> */}

          {/* <AiOutlineClose
              className="absolute top-1 right-2 text-lg text-gray-300 font-semibold cursor-pointer w-8 h-8 p-2 hover:rounded-full hover:bg-white hover:bg-opacity-30"
              onClick={() => isClose()}
            /> */}
        </div>

        {users?.length === 0 ? null : (
          <table className="mt-20">
            <thead>
              <tr>
                <th>FullName</th>
                <th>Email</th>
                <th>Address</th>
                <th>Gender</th>
                <th>PhoneNumber</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user, index) => {
                return (
                  <tr key={index}>
                    <td>{user?.fullName}</td>
                    <td>{user?.email}</td>
                    <td>{user?.address}</td>
                    <td>
                      {user?.gender === "M"
                        ? "Male"
                        : user?.gender === "F"
                        ? "Female"
                        : "Other"}
                    </td>
                    <td>{user?.phoneNumber}</td>
                    <td>
                      <div className="flex items-center justify-center gap-6">
                        <FiEdit
                          className="cursor-pointer text-inputColor"
                          onClick={() => isOpenUpdateUser(user)}
                        />
                        <AiOutlineDelete
                          className="cursor-pointer text-blue-600"
                          onClick={() => isOpenModalDeleteUser(user)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* {isCreateUser && (
        <CreateModal isClose={isCloseCreateUserModal} createNewUser={createNewUser} />
      )} */}

      {isDeleteUser && (
        <div className="fixed z-50 top-0 bottom-0 left-0 right-0 w-full max-h-full bg-black bg-opacity-25"></div>
      )}
      {isDeleteUser && (
        <DeleteModal
          dataUserDelete={dataUserDelete}
          isClose={isCloseDeleteUserModal}
          deleteUser={deleteUser}
        />
      )}
      {/* {
        isUpdateUser && <UpdateModel dataUserUpdate={dataUserUpdate} isClose={isCloseUpdateUserModal} updateUser={updateUser}/>
      } */}
    </Fragment>
  );
};

export default StudentManager;