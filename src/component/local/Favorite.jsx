import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseInit'
import { getDatabase, ref, onValue, remove } from 'firebase/database'
import {Button, Table} from 'react-bootstrap'

const Favorite = () => {
    const db = getDatabase(app);
    const uid = sessionStorage.getItem("uid");
    const [loading, setLoading] = useState(false);
    const [locals, setLocals] = useState([]);


    const callAPI = () => {
        setLoading(true);
        onValue(ref(db, `favorite/${uid}`), (snapshot)=>{
            let rows=[];
            snapshot.forEach(row=>{
                rows.push({key: row.key, ...row.val()});
            });
            setLocals(rows);
            setLoading(false);
        });
    }

    const onClickDelete = async(local) => {
        if(window.confirm(`${local.id}을 삭제하시겠습니까?`))
        {
            await remove(ref(db, `favorite/${uid}/${local.id}`));
        }
    }

    
    useEffect(() => {
        callAPI();
    }, []);
  

    if(loading) return <h1 className = "my-5">로딩중입니다...</h1>
    
    return (
        <div>
            <h1 className = 'my-5'>지역검색</h1>
            <Table striped bordered hover>
                <thead>
                <tr className='text-center'>
                    <td>ID</td>
                    <td>장소명</td>
                    <td>주소</td>
                    <td>전화번호</td>
                    <td>즐겨찾기 취소</td>
                </tr>
                </thead>

                <tbody>
                {locals.map(local=>
                    <tr key={local.id} className='mt-2 text-center align-middle'>
                    <td>{local.id}</td>
                    <td>{local.place_name}</td>
                    <td>{local.address_name}</td>
                    <td>{local.phone}</td>
                    <td><Button onClick={()=>onClickDelete(local)} variant="danger">취소</Button></td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>

    )
}

export default Favorite