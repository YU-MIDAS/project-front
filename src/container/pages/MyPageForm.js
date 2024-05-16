import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../../state/authState";
import AuthToken from "./AuthToken";
import "./MyPageForm.css";

function MyPageForm() {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const navigateToOut = () => {
    navigate("/api/account/withdrawal");
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("currentUserId");
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인한 회원만 볼 수 있습니다.");
      navigate("/");
    } else {
      (async () => {
        try {
          const response = await AuthToken.get(
            `http://3.39.190.90/api/account/me?id=${userId}`
          );
          setAccount(response.data);
        } catch (error) {
          console.error("계정 정보를 가져오는 데 실패했습니다.", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [isLoggedIn, navigate, userId]);

  const onUpdate = async () => {
    try {
      const update_response = await AuthToken.put(
        `http://3.39.190.90/api/account/me?id=${userId}`
      );
    } catch (error) {
      console.error("error : ", error);
    }
  }; // 아직 미구현

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="myPage">
      <h2>내 정보</h2>
      {account ? (
        <div className="accountInfo">
          <ul>
            <li>아이디: {account.accountName}</li>
            <li>닉네임: {account.nickname}</li>
            <li>경도: {account.latitude}</li>
            <li>위도: {account.longitude}</li>
          </ul>
          {<button onClick={navigateToOut}>회원 탈퇴</button>}
          {<button onClick={onUpdate}>정보 수정</button>}
        </div>
      ) : (
        <div>계정 정보를 찾을 수 없습니다.</div>
      )}
    </div>
  );
}

export default MyPageForm;
