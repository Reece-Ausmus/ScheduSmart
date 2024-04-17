import React from "react";
//import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function EventCard(props) {
  function handleDetails() {
    props.onCreate(props.id);
  }

  return (
    <div className="note" style={{borderWidth: "2px", borderStyle: "dashed", borderColor:"#ddd"}}>
            <button 
            style={{
                width: "200px",
                height: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                backgroundColor: "#fff",
              }}
            onClick={handleDetails}>
                <AddCircleOutlineIcon/>
            </button>
    </div>
  );
}

export default EventCard;
