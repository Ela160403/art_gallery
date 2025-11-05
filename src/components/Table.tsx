import { useEffect, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './Table.css'
import "primereact/resources/themes/lara-light-indigo/theme.css"; 
import "primereact/resources/primereact.min.css"; 
import "primeicons/primeicons.css"; 

interface Artwork{
 id:number,
 title:string | null,
 place_of_origin:string | null,
 artist_display:string | null,
 inscriptions:string | null,
 date_start:number | null,
 date_end:number | null, 
}


function Table() {

  const [data,setData]=useState<Artwork[]>([]);
  //for selection
  const [selectedArtworks,setSelectedArtworks]=useState<Artwork[]>([])
  //currentPage
  const [curPage,setCurPage]=useState<number>(1);
  
  const [totalRecords,setTotalRecords]=useState<number>(0);
  const rowsPerPage=12
  
  useEffect(()=>{
    fetch(`https://api.artic.edu/api/v1/artworks?page=${curPage}`)
    .then(res=>res.json())
    .then(result=>{
      //ensuring to set only array data
      if(Array.isArray(result.data)){
        setData(result.data);
        setTotalRecords(result.pagination.total);
      }else{
        console.error('doesnt return an array',result);
      }
    })
    .catch(err=>console.log(err.message));
  },[curPage])

  useEffect(()=>{
    const stored =localStorage.getItem("selectedArtworks");
    if(stored){
      setSelectedArtworks(JSON.parse(stored));
    }
  },[selectedArtworks])

  const handleSelectionChange = (e: any) => {
  const newSelection = e.value as Artwork[];

  // Start with the old selections
  let updatedSelection = [...selectedArtworks];

  // Add newly selected items (avoid duplicates)
  newSelection.forEach(item => {
    if (!updatedSelection.some(sel => sel.id === item.id)) {
      updatedSelection.push(item);
    }
  });

  // Remove items that were deselected on the current page
  updatedSelection = updatedSelection.filter(item =>
    // Keep item if it's not part of the current page
    // or if it's still selected in the current page
    !data.some(d => d.id === item.id) ||
    newSelection.some(sel => sel.id === item.id)
  );

  setSelectedArtworks(updatedSelection);
  localStorage.setItem("selectedArtworks", JSON.stringify(updatedSelection));
};

  const onPageChange =(e:any)=>{
    setCurPage(e.page+1);
  }
  
  const renderValue = (value: any) => (value ? value : "N/A");
  
  return (
  <div className="card">
   {/* conditional rendering */}
   {
    data.length>0?(
      
      // data.map(item=>(
      //   <div key={item.id}>
      //     <h3>{item.title}</h3>
      //     <p>{item.artist_display}</p>
      //     <small>{item.place_of_origin}</small>
      //     <p>
      //       {item.date_start}-{item.date_end}
      //     </p>
      //   </div>))
<>
<div className="selected-info">
          Selected: <strong>{selectedArtworks.length}</strong>{" "}
          {selectedArtworks.length === 1 ? "row" : "rows"}
</div>
<div>
  <input type="button" value="" />
</div>
<DataTable
  value={data}
  paginator
  lazy
  totalRecords={totalRecords}
  first={(curPage - 1) * rowsPerPage}
  rows={rowsPerPage}
  onPage={onPageChange}
  paginatorTemplate="PrevPageLink PageLinks NextPageLink CurrentPageReport"
  paginatorClassName="custom-paginator justify-content-between align-items-center"
  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
  dataKey="id"
  selectionMode="checkbox"
  selection={selectedArtworks}
  onSelectionChange={handleSelectionChange}
  tableStyle={{ minWidth: "70rem" }}
  showGridlines
>
  <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
  <Column
    field="title"
    header="TITLE"
    body={(rowData) => renderValue(rowData.title)}
    style={{ width: "20%" }}
  />
  <Column
    field="place_of_origin"
    header="PLACE OF ORIGIN"
    body={(rowData) => renderValue(rowData.place_of_origin)}
    style={{ width: "15%" }}
  />
  <Column
    field="artist_title"
    header="ARTIST"
    body={(rowData) => renderValue(rowData.artist_title)}
    style={{ width: "20%" }}
  />
  <Column
    field="inscriptions"
    header="INSCRIPTIONS"
    body={(rowData) => renderValue(rowData.inscriptions)}
    style={{ width: "25%" }}
  />
  <Column
    field="date_start"
    header="START DATE"
    body={(rowData) => renderValue(rowData.date_start)}
    style={{ width: "8%" }}
  />
  <Column
    field="date_end"
    header="END DATE"
    body={(rowData) => renderValue(rowData.date_end)}
    style={{ width: "8%" }}
  /> 
</DataTable>
</>
    ):(
      <h1>no data found</h1>
    )
   }
  </div>
  )
}

export default Table

/*

pagination object

"pagination": {
    "total": 130023,
    "limit": 12,
    "offset": 0,
    "total_pages": 10836,
    "current_page": 1,
    "next_url": "https://api.artic.edu/api/v1/artworks?page=2"
  }

data 
 title place_of_origin artist_display inscriptions date_start date_end

*/



