import React, { useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { Search } from "react-feather";
import { FormControl } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";

function Demo() {
  const accessToken = process.env.REACT_APP_GITHUB_ACCESS_TOKEN;

  //giá trị username tìm kiếm
  const [username, setUsername] = useState("");

  //thông tin của username
  const [resultUser, setResultUser] = useState(null);

  //dữ liệu repo username
  const [repos, setRepos] = useState([]);

  //dữ liệu commit repo
  const [commits, setcommits] = useState([]);

  //trạng thái hiển thị của repo
  const [flag, setFlag] = useState(true);

  //trạng thái hiển thị của modal commit
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  // hiển thị thông tin commit trên repo
  const handleShow = (item) => {
    setShow(true);

    //Xử lý chuỗi url_commit
    var temp = item.commits_url;
    console.log(temp.slice(0, temp.indexOf("{/sha}")));
    temp =
      temp.slice(0, temp.indexOf("{/sha}")) +
      "?per_page=10&sort=author-date-desc";
    //Xử lý chuỗi url_commit

    axios
      .get(temp, {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setcommits(res.data);
      })
      .catch((error) => {
        console.log(error);
        alert("Lỗi");
      });
  };

  //Tìm kiếm thông tin username trên github restAPI
  const handleSearch = () => {
    axios
      .get(`https://api.github.com/users/${username}`, {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setResultUser(res.data);
      })
      .catch((error) => {
        console.log(error);
        alert("Lỗi");
      });
  };

  // Hiển thị các repo của username trên github
  const handleMore = () => {
    axios
      .get(resultUser.repos_url, {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      })
      .then((res) => {
        setRepos(res.data);
      })
      .catch((error) => {
        console.log(error);
        alert("Lỗi");
      });
  };

  return (
    <>
      <div className="row">
        <FormControl
          type="text"
          placeholder="Enter text"
          onChange={(e) => {
            setUsername(e.target.value);
            setFlag(true);
            setResultUser(null);
          }}
        />
      </div>
      <div className="row">
        <Button variant="outline-primary" onClick={handleSearch}>
          <Search />
        </Button>
      </div>
      {resultUser === null ? (
        <></>
      ) : (
        // Thông tin username + avatar
        <div className="row">
          <Card style={{ width: "18rem" }}>
            <Card.Img variant="top" src={resultUser.avatar_url} />
            <Card.Body>
              <Card.Title>{resultUser.login}</Card.Title>
              {flag ? (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleMore();
                    setFlag(false);
                  }}
                >
                  More
                </Button>
              ) : (
                <Button
                  variant="danger"
                  onClick={() => {
                    setFlag(true);
                  }}
                >
                  Hide
                </Button>
              )}
            </Card.Body>
          </Card>
        </div>
      )}
      {flag ? (
        <></>
      ) : (
        //Thông tin repo của username
        <div className="container-fluid">
          <div className="row">
            <Table bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Star number</th>
                  <th>Issues number</th>
                </tr>
              </thead>
              <tbody>
              
                { repos.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => {
                      handleShow(item);
                    }}
                  >
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.stargazers_count}</td>
                    <td>{item.open_issues}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}

      {/* //Modal thông tin commit của repo */}
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Commit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table hover bordered>
            <thead>
              <tr>
                <th>Author</th>
                <th>Commit Message</th>
                <th>Commit Id</th>
              </tr>
            </thead>
            <tbody>
              {commits.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => {
                    window.open(item.html_url);
                  }}
                >
                  <td>{item.commit.author.name}</td>
                  <td>{item.commit.message}</td>
                  <td>{item.sha}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Demo;
