import Header from "../common/Header";
import TableSortAndSelection from "../common/Table";
import PhoneNumberInput from "../phoneNumber/PhoneNumberInput";

import "@/styles/globals.css";


const DashboardContent = () => {
  return (
    <>
      <Header />
      <PhoneNumberInput/>
      <TableSortAndSelection />
    </>
  );
};

export default DashboardContent;
