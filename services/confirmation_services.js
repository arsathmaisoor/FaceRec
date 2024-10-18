// confirmation_services.js

import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { firestore } from '../config/firebase_config';



// Function to confirm attendance
export const confirmAttendance = (imageName) => {
    // If imageName is available, confirm attendance for the specific employee
    if (imageName) {
      console.log(`Attendance confirmed for ${imageName}`);
      markAttendance(imageName);
      // You could also send this data to an API or log it in a database here
      return `${imageName}`;

    } else {
      // Handle cases where no imageName is provided (e.g., no match found)
      console.log('No attendance to confirm.');
      return 'No attendance to confirm.';
    }
  };

const markAttendance=async(imageName)=>{
    await setDoc(doc(firestore, 'Attendance', imageName), {
        imageName,
        timestamp: serverTimestamp(),
      });
}
  