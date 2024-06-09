import React, { useState } from 'react'
import {Row, Col, Form, InputGroup, Card, Button} from 'react-bootstrap';
import {app} from '../../firebaseInit'
import {createUserWithEmailAndPassword, getAuth}  from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import "../Paging.css";

const Join = () => {

    const navi = useNavigate();
    const auth = getAuth(app);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        email:'test01@gmail.com',
        pw:'12341234'
    });

    const {email, pw} = form;

    const onChange = (e) =>{
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }

    const onSubmit = (e) =>{
        e.preventDefault();
        if(email ==="" || pw ==="")
        {
            alert("이메일/비밀번호를 입력하세요");
        }
        else{
            setLoading(true);
            createUserWithEmailAndPassword(auth, email, pw)
            .then(success=>{
                alert("이메일 가입 성공하였습니다!");
                setLoading(false);
                navi('/login');
            })
            .catch(error=>{
                alert("에러:" + error.message);
                setLoading(false);
            })
        }
    }

    if(loading) return <h1 className='my-5'>로딩중입니다...</h1>
  return (
    <div>
        <Row className='my-5 justify-content-center'>
            <Col md={6} lg={4}>
                <Card>
                    <Card.Header>
                        <h3 className='text-center'>회원가입</h3>
                    </Card.Header>

                    <Card.Body>
                        <Form onSubmit = {onSubmit}>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text style={{ width: '30%' }} className = "justify-content-center">이메일</InputGroup.Text>
                                <Form.Control name="email" value={email} onChange={onChange}/>
                            </InputGroup>   

                            <InputGroup className='mb-2'>
                                <InputGroup.Text style={{ width: '30%' }} className = "justify-content-center">비밀번호</InputGroup.Text>
                                <Form.Control name="pw" type="password" value={pw} onChange={onChange}/>
                            </InputGroup>

                            <div>
                                <Button className='w-100 custom-button' type="submit">회원가입</Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default Join
