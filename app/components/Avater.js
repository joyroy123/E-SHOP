import Image from "next/image";
import {FaUserCircle} from "react-icons/fa";

const Avater = ({src}) => {
    if(src){
        return (
            <Image src={src} alt="Avater" className="rounded-full" height="30" width="30" />
        );
    };
    return ( 
        <FaUserCircle size={24} />
     );
}
 
export default Avater;