// Import the core libraries and functions
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

// Import the used components
import AvailableBooths from './AvailableBooths/AvailableBooths'
import ContactButton from '../ReuseableComponents/ContactButton'
import EditHeader from "./EditHeader";
import Header from './Header'
import VerificationComponent from '../ReuseableComponents/VerificationComponent'

// Import the used MUI components
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Grid, Stack } from "@mui/material";
// Import the local stylesheet
// import "./EventDetails.css";

// ----------------------------------------------
// Component that contains all the display components on
// the `EventDetails` page for a specific event
function EventDetails() {

  // Stores
  const eventBoothDetails = useSelector((store) => store.boothApplications);
  const user = useSelector((store) => store.user);
  const events1 = useSelector((store) => store.events);
  const events = useSelector(store => store.eventsContainer.allEvents)
  const event = useSelector(store => store.eventsContainer.currentEvent)

  // Local State
  const [viewList, setViewList] = useState("");
  const [editEvent, setEditEvent] = useState(false);

  // Initialze the used variables
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  let eventDetails = events1
    .filter((event) => event.id === Number(eventId))
    .pop();

  useEffect(() => {
    dispatch({
      type: "FETCH_CURRENT_EVENT",
      payload: {
        eventId: eventId,
      }
    })
  }, [eventId])

  useEffect(() => {
    dispatch({
      type: "FETCH_VENDOR_BOOTH_APPLICATIONS",
      payload: {
        id: eventId,
      },
    });
  }, [eventId]);

  function handleApprove(boothId) {
    dispatch({
      type: "APPROVE_BOOTH_APP",
      payload: {
        boothAppId: boothId,
        id: eventId,
      },
    });
  }

  function toggleEdit() {
    setEditEvent(!editEvent);
  }

  return (
    // adding booths and available booths
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
    {/* pass through props to tell component rendering on page vs. card
        and to render for an event vs host/vendor */}
    {/* <VerificationComponent
      props={{
        view: 'page',
        type: 'event',
        details: eventDetails
        }} 
    /> */}
    {user &&
      <>
        {editEvent === true ? (
        <EditHeader
          toggleEdit={toggleEdit}
          eventId={eventId}
          eventDetails={eventDetails}
        />
      ) : (
        eventDetails && <Header toggleEdit={toggleEdit} eventDetails={eventDetails} />
      )}
      </>
    }
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{
          margin: '1em'
        }}
      >
      <h1>Available Booths</h1>
      {eventDetails && 
        <AvailableBooths props={eventDetails} />
      }
      <div>
        <table className="booths_info"></table>
      </div>
      {user.type !== 'vendor' &&
        <>
            <TableContainer
              component={Paper}
              sx={{
                padding: '1em'
              }}
            >
            <h2>Pending Approval</h2>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" className="pending">
                    <TableHead>
                        <TableRow>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Description</TableCell>
                      
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {eventBoothDetails.map((booths)=> {
                          if(booths.approved_by_host === "PENDING"){
                            return(
                                <TableRow key={booths.id}> 
                                    <TableCell 
                                      onClick={() => history.push(`/profile/${booths.vendor_id}`)}
                                    >
                                      {booths.business_name}
                                    </TableCell>
                                    <TableCell>{booths.type}</TableCell>
                                    <TableCell>{booths.description}</TableCell>
                                    <Button size="small" variant="outlined" onClick={() => handleApprove(booths.boothApp_id)}>✅</Button>
                                    <Button size="small" variant="outlined" startIcon={<DeleteIcon />} onClick={ () => dispatch({type: 'DELETE_BOOTH', payload: {id: booths.booth_id} })} ></Button>
                                </TableRow>
                                )}
                            })}
                            </TableBody>
            </Table>
          </TableContainer>

          <ContactButton contactProps={{emails: ['one', 'two'], buttonText: 'Email Vendors'}} />
                
          <TableContainer 
            component={Paper}
            sx={{
              padding: '1em'
            }}
          >
            <h2>Approved</h2>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" className="approved">
                    <TableHead>
                        <TableRow>
                            <TableCell > Vendor Name</TableCell>
                            <TableCell> Type</TableCell>
                            <TableCell> Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                      {eventBoothDetails.map((list) => {
                          if (list.approved_by_host === "APPROVED")
                            return(
                                <TableRow key={list.id}>
                                    <TableCell 
                                      onClick={() => history.push(`/profile/${list.vendor_id}`)}
                                    >
                                      {list.business_name}
                                    </TableCell >
                                    <TableCell >{list.type}</TableCell >
                                    <TableCell >{list.description}</TableCell >
                                    <Button variant="outlined" disabled>Approved</Button>
                                </TableRow>
                            )
                        })}
                    </TableBody>
            </Table>
          </TableContainer>
        </>
      }
      </Stack>
      
    </Grid>
  );
}
export default EventDetails;
