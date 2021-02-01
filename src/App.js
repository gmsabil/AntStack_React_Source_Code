import React, { useState } from "react";
import * as XLSX from "xlsx";
import DataTable from "react-data-table-component";
import SortIcon from "@material-ui/icons/ArrowDownward";

function App() {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  const processData = data => {
    //Copied from stack overflow to split and process the data from CSV file
    const finalData = data.split(/\r\n|\n/);
    console.log(finalData);
    const headers = finalData[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    console.log(headers);
    const list = [];

    for (let i = 1; i < finalData.length; i++) {
      const row = finalData[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        if (Object.values(obj).filter(x => x).length > 0) {
          list.push(obj);
        }
      }
    }

   //Prepare Columns
    var columns = headers.map(c => ({
      name: c,
      selector: c
    }));

    for (let listItem of list) {
      var tempItem = listItem.items;
      tempItem = tempItem.replaceAll(":", "-");
      tempItem = tempItem.replaceAll(";", "\n");
      //To Split the data to new line code copied from https://www.jsdiaries.com/how-to-create-a-new-line-in-jsx-and-reactjs/
      tempItem = tempItem.split("\n").map((item, i) => <p key={i}>{item}</p>);
      listItem.items = [];
      listItem.items = tempItem;
    }
    console.log(columns);
    setData(list);
    setColumns(columns);
  };

  // file upload
  const fileUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = evt => {
      const bstr = evt.target.result;
      const workBook = XLSX.read(bstr, { type: "binary" });
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];
      const data = XLSX.utils.sheet_to_csv(workSheet, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <h5>Ant Stack POC - React</h5>
      <br/>
      <input type="file" accept=".csv,.xlsx,.xls" onChange={fileUpload} />
      <DataTable
        sortable
        defaultSortField="orderId"
        sortIcon={<SortIcon />}
        pagination
        highlightOnHover
        columns={columns}
        data={data}
      />
    </div>
  );
}

export default App;
