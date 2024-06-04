import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../state/authState";
import Paging from "../container/pages/Community/Paging";
import AuthToken from "../container/pages/AuthToken";
import "../Button.css";
import "../container/pages/Community/Community.css";

const CommunityList = ({ postType }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [boardList, setBoardList] = useState([
    {
      id: "",
      title: "",
      recommend: "",
      writer: "",
      adopted: "",
      view: "",
    },
  ]);
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("page");
  const [searchBy, setSearchBy] = useState("title");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(isLoggedInState);

  const NavigateToWrite = () => {
    navigate(`/community-${postType}/write`);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    navigate(`/community-${postType}/${post.id}`);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchBy(e.target.value);
  };

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (postType === "bunri") {
          const response = await AuthToken.get(
            `http://3.39.190.90/api/questionBoard/read/paging?page=${page}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          localStorage.setItem(
            "bunri-totalElements",
            response.data.totalElements
          );
          const inputData = await response.data.content.map((data) => ({
            id: data.id,
            title: data.title,
            recommend: data.recommend,
            writer: data.writer,
            adopted: data.adopted,
            view: data.view,
          }));
          setBoardList(inputData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchBoardData();
  }, [postType]);

  const handleSearch = () => {
    const filtered = boardList.filter((post) => {
      if (searchBy === "title") {
        return post.title.includes(query);
      } else if (searchBy === "writer") {
        return post.writer.includes(query);
      }
      return false;
    });
    if (filtered.length === 0) {
      window.confirm("검색 결과가 없습니다.");
    } else {
      setSearchResults(filtered);
      setPage(1);
    }
  };

  const sortedPostsByCriteria = (boardList) => {
    if (sortBy === "nanum") {
      return boardList.filter((post) => post.nanum);
    }
    return [...boardList].sort((a, b) => {
      switch (sortBy) {
        case "page":
          return b.id - a.id;
        //case "date":
        //return new Date(a.date) - new Date(b.date);
        case "recommend":
          return b.recommend - a.recommend;
        case "view":
          return b.view - a.view;
        default:
          return 0;
      }
    });
  };

  const paginatedPosts = sortedPostsByCriteria(
    searchResults.length > 0 ? searchResults : boardList
  ).slice((page - 1) * 10, page * 10);

  return (
    <>
      <div className="NotDrag">
        {isMobile ? (
          <table className="mobile-table-container">
            {paginatedPosts.map((post) => (
              <tr key={post.id} onClick={() => handlePostClick(post)}>
                <p className="title">
                  {post.title.length > 40
                    ? post.title.slice(0, 40) + "..."
                    : post.title}
                </p>
                <div>
                  <p className="info">
                    {post.writer} | 조회수 {post.view} | 추천수 {post.recommend}{" "}
                    | {post.date}
                    {postType === "nanum" &&
                      (post.nanum === "O" ? " | 나눔 완료" : " | 나눔 진행 중")}
                    {postType === "bunri" &&
                      (post.adopted === "true"
                        ? " | 채택 완료"
                        : " | 채택 미완료")}
                  </p>
                </div>
              </tr>
            ))}
          </table>
        ) : (
          <table className="table-container">
            <thead>
              <tr>
                <th>글 번호</th>
                <th>제목</th>
                <th>글쓴이</th>
                <th>조회수</th>
                <th>추천수</th>
                {postType === "bunri" && <th>채택 완료</th>}
                {postType === "nanum" && <th>나눔 완료</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedPosts.map((post) => (
                <tr key={post.id} onClick={() => handlePostClick(post)}>
                  <td>{post.id}</td>
                  <td>
                    {post.title.length > 30
                      ? post.title.slice(0, 30) + "..."
                      : post.title}
                  </td>
                  <td>{post.writer}</td>
                  <td>{post.view}</td>
                  <td>{post.recommend}</td>
                  {postType === "bunri" && <td>{post.adopted}</td>}
                  {postType === "nanum" && <td>{post.nanum}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div
          className={isMobile ? "" : "search-controls"}
          style={{ paddingTop: "20px" }}
        >
          <select
            className="sort-container"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="page">페이지 번호순 정렬</option>
            <option value="recommend">추천순 정렬</option>
            <option value="view">조회순 정렬</option>
            {postType === "bunri" && (
              <option value="bunri">채택완료순 정렬</option>
            )}
            {postType === "nanum" && (
              <option value="nanum">나눔완료순 정렬</option>
            )}
          </select>
          {isMobile ? <div style={{ marginBottom: "15px" }} /> : <></>}
          <div className="search-container">
            <select
              className="searchBy-container"
              value={searchBy}
              onChange={handleSearchChange}
            >
              <option value="title">제목</option>
              <option value="writer">글쓴이</option>
            </select>
            <input
              type="text"
              placeholder="입력"
              className="community-search-input"
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <button className="searchbutton" onClick={handleSearch}>
              검색
            </button>
            {!isMobile &&
              (isLoggedIn ? (
                <button
                  className="write-green-button"
                  onClick={NavigateToWrite}
                >
                  글쓰기
                </button>
              ) : (
                <button className="disabled-write-button">글쓰기</button>
              ))}
          </div>
        </div>

        <div>
          <Paging
            totalItemsCount={
              searchResults.length > 0
                ? searchResults.length
                : localStorage.getItem("bunri-totalElements")
            }
            onPageChange={handlePageChange}
          />
          {isMobile &&
            (isLoggedIn ? (
              <button className="write-green-button" onClick={NavigateToWrite}>
                글쓰기
              </button>
            ) : (
              <button className="disabled-write-button">글쓰기</button>
            ))}
        </div>
      </div>
    </>
  );
};

export default CommunityList;
