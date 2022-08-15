import { useSelector } from "react-redux";
import EventListVendor from "./EventListViews/EventListVendor";
import EventListHost from "./EventListViews/EventListHost";
import EventListAdmin from "./EventListViews/EventListAdmin";

function EventsList() {
    // Stores
    const user = useSelector((store) => store.user);

    switch(user.type) {
        case 'host':
            return (
                <EventListHost />
            );
        case 'vendor':
            return (
                <EventListVendor />
            )
        case 'admin':
            return (
                <EventListAdmin />
            )
        default:
            return (
                <>
                    <h2>404 Error #522678-e702</h2>
                </>
            )
    }
}
export default EventsList;