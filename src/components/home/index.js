import { Component } from "react";
import "./index.css";
import MyLoader from "../myLoader";

class Home extends Component {
  state = {
    query: "",
    loading: false,
    images: [],
    error: null,
    hoveredImage: null,
    searchClicked:false,
    currentPage: 1,
    totalPages: null
  };

  handleInputChange = (event) => {
    this.setState({ query: event.target.value });
  };

  handleSearch = async () => {
    const { query, currentPage } = this.state;
    if (query.trim() === "") return;

    this.setState({ loading: true });

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?per_page=30&page=${currentPage}&query=${query}&client_id=SAiNdZ2kUfsrcHCgNk1arLfobJfsTBhl-3t8IjZstYY`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      this.setState({
        images: data.results,
        loading: false,
        totalPages: data.total_pages
      });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  };

  handleKeywordClick = (keyword) => {
    this.setState({ query: keyword }, () => {
      this.handleSearch();
    });
  };

  handleImageHover = (index) => {
    this.setState({ hoveredImage: index });
  };

  handlePrevPage = () => {
    this.setState((prevState) => ({
      currentPage: prevState.currentPage - 1
    }), () => {
      this.handleSearch();
    });
  };

  handleNextPage = () => {
    this.setState((prevState) => ({
      currentPage: prevState.currentPage + 1
    }), () => {
      this.handleSearch();
    });
  };

  render() {
    const { query, loading, images, error, hoveredImage,searchClicked,currentPage, totalPages } = this.state;
    const keywords = ["Mountain", "Flowers", "Beaches", "Cities"];

    return (

      <div className="home-cont">
        <h1 className="heading">Image Search App</h1>
        <div className="searchinput-button-cont">
          <input type="text" value={query} onChange={this.handleInputChange} placeholder="type some thing to search images"/>
          <button type="button" onClick={this.handleSearch} disabled={loading}>
            Search
          </button>
        </div>
      
        <div className="keywords-container">
          {keywords.map((keyword, index) => (
            <button key={index} onClick={() => this.handleKeywordClick(keyword)}>
              {keyword}
            </button>
          ))}
        </div>
        {loading && (
            <div className="loader-container">
              {" "}
              <MyLoader />{" "}
            </div>
          )}

        
          
          {error && <div>Error: {error}</div>}
        <div className="image-container">
        {(images.length===0 && query!=="" && searchClicked) && (<h1>Sorry, no images were found.</h1>)}
          {images.map((image) => (
            <div
              key={image.id}
              className="image"
              onMouseEnter={() => this.handleImageHover(image.id)}
              onMouseLeave={() => this.handleImageHover(null)}
            >
              <img src={image.urls.small} className="image-size" alt={image.alt_description} />
              {hoveredImage === image.id && (
                <div className="image-details">
                  <p>{image.alt_description}</p>
                  <p>By: {image.user.name}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        {totalPages && (
          <div className="pagination-container">
            <button onClick={this.handlePrevPage} disabled={currentPage === 1}>Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={this.handleNextPage} disabled={currentPage === totalPages}>Next</button>
          </div>
        )}
      </div>
    );
  }
}

export default Home;
