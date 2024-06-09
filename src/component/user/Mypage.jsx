import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap'
import { app } from '../../firebaseInit'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import ModalAddress from './ModalAddress'
import ModalPhoto from './ModalPhoto'

const Mypage = () => {
    const db = getFirestore(app);
    const uid = sessionStorage.getItem('uid');
    const email = sessionStorage.getItem('email');
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        email: email,
        name: '미정',
        phone: '010-1234-1234',
        address1: '용인 현대아파트',
        address2: '2동 509호'
    });

    const { name, phone, address1, address2 } = form; // 비구조할당

    const onChangeForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const onAddress = (address) => {
        setForm({
            ...form,
            address1: address
        });
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (name === '') {
            alert("이름을 입력하세요!");
            return;
        }
        if (!window.confirm('사용자 정보를 수정하실래요?')) return;

        // 사용자 정보를 저장
        setLoading(true);
        await setDoc(doc(db, `users/${uid}`), form);
        setLoading(false);
    }

    const callAPI = async () => {
        setLoading(true);
        const res = await getDoc(doc(db, 'users', uid));
        if (res.data()) {
            setForm(res.data());
        } else {
            setDoc(doc(db, 'users', uid), form);
        }
        setLoading(false)
    }

    useEffect(() => {
        callAPI();
    }, []);

    if (loading) return <h1 className='my-5'>로딩중입니다......</h1>
    return (
        <Row className='my-5 justify-content-center'>
            <Col xs={12} md={10} lg={8}>
                <Card>
                    <Card.Header>
                        <h3 className='text-center'>마이페이지</h3>
                    </Card.Header>

                    <Card.Body>
                        <Row>
                            <Col xs={12} md={4} className='text-center mt-2'>
                                <ModalPhoto form={form} setForm={setForm} setLoading={setLoading}/>
                            </Col>
                            <Col xs={12} md={8}>
                                <form onSubmit={onSubmit}>
                                    <InputGroup className='mb-2'>
                                        <InputGroup.Text style={{ width: '100px', backgroundColor: '#b094e6', color: 'white' }}>이름</InputGroup.Text>
                                        <Form.Control name="name" value={name} onChange={onChangeForm} />
                                    </InputGroup>
                                    <InputGroup className='mb-2'>
                                        <InputGroup.Text style={{ width: '100px', backgroundColor: '#b094e6', color: 'white' }}>전화</InputGroup.Text>
                                        <Form.Control name="phone" value={phone} onChange={onChangeForm} />
                                    </InputGroup>
                                    <InputGroup className='mb-2'>
                                        <InputGroup.Text style={{ width: '100px', backgroundColor: '#b094e6', color: 'white' }}>주소</InputGroup.Text>
                                        <Form.Control name="address1" value={address1} onChange={onChangeForm} />
                                        <ModalAddress />
                                    </InputGroup>

                                    <Form.Control className='mb-2' name="address2" value={address2} onChange={onChangeForm} placeholder='상세주소' />

                                    <div className='text-center mt-3'>
                                        <Button className='px-5' type="submit" style={{ backgroundColor: '#b094e6', border: 'none' }}>저장</Button>
                                        <Button variant='secondary' className='ms-2 px-3'>취소</Button>
                                    </div>
                                </form>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default Mypage;
