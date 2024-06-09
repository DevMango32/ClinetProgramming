import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Row, Col, InputGroup, Form, Button, Table } from 'react-bootstrap';
import { FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { app } from '../../firebaseInit';
import { getDatabase, ref, get, set } from 'firebase/database';
import "../Paging.css";

const Locals = () => {
  const db = getDatabase(app);
  const navi = useNavigate();
  const uid = sessionStorage.getItem('uid');

  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('인하대학교');
  const [page, setPage] = useState(1);
  const [locals, setLocals] = useState([]);

  const callAPI = async () => {
    setLoading(true);
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}&size=12&page=${page}`;
    const config = { headers: { "Authorization": "KakaoAK 52d7f58041770d9379624d31e28ea377" } };
    const res = await axios.get(url, config);
    setLocals(res.data.documents);
    setLoading(false);
  };

  useEffect(() => {
    callAPI();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    callAPI();
  };

  const onClickFavorite = (local) => {
    if (!uid) {
      sessionStorage.setItem('target', '/locals');
      navi('/login');
      return;
    }

    if (window.confirm("즐겨찾기에 추가하실래요?")) {
      get(ref(db, `favorite/${uid}/${local.id}`)).then(snapshot => {
        if (snapshot.exists()) {
          alert("이미 즐겨찾기에 등록 되어있습니다.");
        } else {
          set(ref(db, `favorite/${uid}/${local.id}`), { ...local });
          alert("즐겨찾기에 추가 되었습니다.");
        }
      });
    }
  };

  if (loading) return <h1 className='my-5'>로딩중입니다...</h1>;

  return (
    <div>
      <h1 className='my-5'>지역검색</h1>
      <Row className='mb-2 justify-content-end'>
        <Col xs={8} md={6} lg={4}>
          <Form onSubmit={onSubmit}>
            <InputGroup>
              <Form.Control onChange={(e) => setQuery(e.target.value)} placeholder='검색어' value={query} />
              <Button type="submit" className="custom-button">검색</Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead thead-dark>
          <tr className='text-center'>
            <td>ID</td>
            <td>장소명</td>
            <td>주소</td>
            <td>전화번호</td>
            <td>즐겨찾기</td>
          </tr>
        </thead>

        <tbody>
          {locals.map(local =>
            <tr key={local.id} className='mt-2 text-center align-middle'>
              <td>{local.id}</td>
              <td>{local.place_name}</td>
              <td>{local.address_name}</td>
              <td>{local.phone}</td>
              <td>
                <Button 
                  style={{ backgroundColor: 'transparent', border: 'none', outline: 'none' }}
                  onClick={() => onClickFavorite(local)}> <FaStar style={{color: '#b094e6'}}/>
                </Button>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Locals;
