import React from "react";
//import DeleteIcon from "@material-ui/icons/Delete";
import DetailsIcon from '@mui/icons-material/Details';

function EventCard(props) {
  function handleDetails() {
    props.onDetails(props.id);
  }

  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={handleDetails}>
        <DetailsIcon />
      </button>
    </div>
  );
}

export default EventCard;
