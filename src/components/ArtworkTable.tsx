// // ArtworksTable.jsx
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Button } from 'primereact/button';

// const ArtworkTable = ({
//   artworks,
//   totalRecords,
//   lazyParams,
//   onPage,
//   loading,
//   selectedArtworks,
//   onSelectionChange
// }) => {
//   return (
//     <div className="card">

//       <DataTable
//         value={artworks}
//         paginator
//         lazy
//         totalRecords={totalRecords}
//         first={lazyParams.first}
//         rows={lazyParams.rows}
//         onPage={onPage}
//         loading={loading}
//         dataKey="id"
//         selectionMode="checkbox"
//         selection={selectedArtworks}
//         onSelectionChange={onSelectionChange}
//         responsiveLayout="scroll"
//       >
//         {/* Checkbox column */}
//         <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>

//         {/* Data columns */}
//         <Column field="id" header="ID" ></Column>
//         <Column field="title" header="Title" ></Column>
//         <Column field="artist_display" header="Artist"></Column>
//         <Column field="place_of_origin" header="Origin"></Column>
//         <Column field="date_display" header="Date"></Column>
//       </DataTable>

      
//     </div>
//   );
// };

// export default ArtworkTable;
