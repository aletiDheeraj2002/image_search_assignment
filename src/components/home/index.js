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
    searchClicked:false
  };

  handleInputChange = (event) => {
    this.setState({ query: event.target.value });
  };

  handleSearch = async () => {
    const { query } = this.state;
    if (query.trim() === "") return;

    this.setState({ loading: true });

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?per_page=30&page=1&query=${query}&client_id=SAiNdZ2kUfsrcHCgNk1arLfobJfsTBhl-3t8IjZstYY`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      this.setState({ images: data.results, loading: false,searchClicked:true });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  };

  handleImageHover = (index) => {
    this.setState({ hoveredImage: index });
  };

  render() {
    const { query, loading, images, error, hoveredImage,searchClicked } = this.state;

    return (
      <div className="home-cont">
        <h1 className="heading">Image Search App</h1>
        <div className="searchinput-button-cont">
          <input type="text" value={query} onChange={this.handleInputChange} placeholder="type some thing to search images"/>
          <button type="button" onClick={this.handleSearch} disabled={loading}>
            Search
          </button>
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
      </div>
    );
  }
}

export default Home;
