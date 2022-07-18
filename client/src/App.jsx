import './App.css';
import TinderCard from 'react-tinder-card'
import axios from 'axios';
import { useEffect, useState} from 'react';
import { v4 as uuid } from 'uuid';

const App = () => {
  const [data, setData] = useState([])

  const [sessionId, setSessionId] = useState(uuid())

  const [liked, setLiked] = useState(false)

  const onSwipe = async (direction, listingId) => {
    setLiked(false)

    if (direction === "left") {
      await axios.delete(`http://localhost:5000/listings/delete/${listingId}`);
    } else {
      await axios.post("http://localhost:5000/listings/recordSwipe", { id: listingId, session_id: sessionId, direction });
    }
  }

  const handleClick = async (listingId) => {
    setLiked(!liked)

    await axios.post("http://localhost:5000/listings/updateLike", { id: listingId });
  }

  const showDetails = listing => {
    alert(`Name: ${listing.name}\n Price : $${listing.price['$numberDecimal']} \n Minimum Nights : ${listing.minimum_nights}\n Beds : ${listing.beds}`);
  }

  useEffect(() => {
    const fetchListings = async () => {
      const response = await axios.get(`http://localhost:5000/listings`);
      const json = await response.data;
      setData(json)
    }
    fetchListings()
  }, [])

  const likeButtonLabel = liked ? '❤' : 'Like';

  return (
    <div className="app">
      <div>
        <h1>LisTinder</h1>
        <h2>Swipe left for drop or right to save...</h2>

        <div className="card-container">
          {data.map((listing) =>
            <TinderCard className='swipe' key={listing.name} onSwipe={(dir) => onSwipe(dir, listing._id)}  >
              <div style={{ backgroundImage: 'url(' + listing.images.picture_url + ')' }} className='card'>
                <div className="card-details">
                  <h3>{listing.name}</h3>
                  <div className="card-actions">
                    <button className="button" onClick={() => handleClick(listing._id)}>{likeButtonLabel}</button>
                    <button className="button" onClick={() => showDetails(listing)}>See Details</button>
                  </div>
                </div>
              </div>
            </TinderCard>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
