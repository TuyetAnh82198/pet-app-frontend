import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { List, EnvelopePaperHeartFill } from "react-bootstrap-icons";
import { House, Search, ListUl } from "react-bootstrap-icons";
import { FileEarmarkPerson, PencilSquare } from "react-bootstrap-icons";
import { Container, Navbar } from "react-bootstrap";

import styles from "./rootLayout.module.css";

const Layout = () => {
  //state animation cho sidebar
  const [isToggle, setIsToggle] = useState(false);

  return (
    <div>
      {!isToggle && (
        <div className="d-flex">
          <div
            className="col-1"
            style={{
              minHeight: "100vh",
              width: "5rem",
              backgroundColor: "#7386D5",
            }}
          >
            <div
              style={{
                width: "5rem",
              }}
            >
              <div className="col-12">
                <Navbar className="mb-2">
                  <Container className={styles.containerList}>
                    <Navbar.Brand className="mx-auto">
                      <List
                        style={{ color: "white" }}
                        size={30}
                        onClick={() => setIsToggle(!isToggle)}
                      />
                    </Navbar.Brand>
                  </Container>
                </Navbar>
                <Navbar>
                  <NavLink
                    to="/"
                    style={{ textAlign: "center" }}
                    className={({ isActive }) =>
                      isActive
                        ? styles.containerIsActive
                        : styles.containerNotActive
                    }
                  >
                    <House /> <br />
                    Home
                  </NavLink>
                </Navbar>
                <Navbar>
                  <NavLink
                    style={{ textAlign: "center" }}
                    to="/edit"
                    className={({ isActive }) =>
                      isActive
                        ? styles.containerIsActive
                        : styles.containerNotActive
                    }
                  >
                    <PencilSquare className="mb-1" /> Edit
                  </NavLink>
                </Navbar>
                <Navbar>
                  <NavLink
                    to="/search"
                    style={{ textAlign: "center" }}
                    className={({ isActive }) =>
                      isActive
                        ? styles.containerIsActive
                        : styles.containerNotActive
                    }
                  >
                    <Search className="mb-1" /> Search
                  </NavLink>
                </Navbar>
                <Navbar>
                  <NavLink
                    to="/breed"
                    style={{ textAlign: "center" }}
                    className={({ isActive }) =>
                      isActive
                        ? styles.containerIsActive
                        : styles.containerNotActive
                    }
                  >
                    <ListUl className="mb-1" /> Breed
                  </NavLink>
                </Navbar>
              </div>
            </div>
          </div>
          <div className="col-11 mx-auto">
            <Outlet />
          </div>
        </div>
      )}
      {isToggle && (
        <div className="d-flex">
          <div
            className="col-2"
            style={{
              minHeight: "100vh",
              backgroundColor: "#7386D5",
            }}
          >
            <div>
              <div className="col-12">
                <Navbar className="mb-2">
                  <Container className={styles.containerList}>
                    <Navbar.Brand className={`${styles.navBarItem}`}>
                      <div
                        style={{ color: "white" }}
                        onClick={() => setIsToggle(!isToggle)}
                      >
                        <EnvelopePaperHeartFill
                          className={`${styles.appIcon}`}
                        />{" "}
                        <h2 className={`d-inline ${styles.petApp}`}>Pet App</h2>
                      </div>
                    </Navbar.Brand>
                  </Container>
                </Navbar>
                <Navbar>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive
                        ? styles.containerIsActive
                        : styles.containerNotActive
                    }
                  >
                    <House className="mb-1" /> Home
                  </NavLink>
                </Navbar>
                <Navbar>
                  <NavLink
                    to="/edit"
                    className={({ isActive }) =>
                      isActive
                        ? styles.containerIsActive
                        : styles.containerNotActive
                    }
                  >
                    <FileEarmarkPerson className="mb-1" /> Edit
                  </NavLink>
                </Navbar>
                <Navbar>
                  <NavLink
                    to="/search"
                    className={({ isActive }) =>
                      isActive
                        ? styles.containerIsActive
                        : styles.containerNotActive
                    }
                  >
                    <Search className="mb-1" /> Search
                  </NavLink>
                </Navbar>
                <Navbar>
                  <NavLink
                    to="/breed"
                    className={({ isActive }) =>
                      isActive
                        ? styles.containerIsActive
                        : styles.containerNotActive
                    }
                  >
                    <ListUl className="mb-1" /> Breed
                  </NavLink>
                </Navbar>
              </div>
            </div>
          </div>
          <div className="col-10">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
