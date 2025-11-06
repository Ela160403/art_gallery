import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import "./Table.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

interface Artwork {
  id: number;
  title: string | null;
  place_of_origin: string | null;
  artist_title: string | null;
  inscriptions: string | null;
  date_start: number | null;
  date_end: number | null;
}

function Table() {
  const [data, setData] = useState<Artwork[]>([]);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [curPage, setCurPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [selectCount, setSelectCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const overlayPanelRef = useRef<OverlayPanel>(null);
  const rowsPerPage = 12;

  useEffect(() => {
    fetch(`https://api.artic.edu/api/v1/artworks?page=${curPage}`)
      .then((res) => res.json())
      .then((result) => {
        if (Array.isArray(result.data)) {
          setData(result.data);
          setTotalRecords(result.pagination.total);
        } else {
          console.error("doesnt return an array", result);
        }
      })
      .catch((err) => console.log(err.message));
  }, [curPage]);

  useEffect(() => {
    const stored = localStorage.getItem("selectedArtworks");
    if (stored) {
      setSelectedArtworks(JSON.parse(stored));
    }
  }, []);

  const handleSelectionChange = (e: any) => {
    const newSelection = e.value as Artwork[];
    let updatedSelection = [...selectedArtworks];

    newSelection.forEach((item) => {
      if (!updatedSelection.some((sel) => sel.id === item.id)) {
        updatedSelection.push(item);
      }
    });

    updatedSelection = updatedSelection.filter(
      (item) =>
        !data.some((d) => d.id === item.id) ||
        newSelection.some((sel) => sel.id === item.id)
    );

    setSelectedArtworks(updatedSelection);
    localStorage.setItem("selectedArtworks", JSON.stringify(updatedSelection));
  };

  const handleCustomRowSelection = async (): Promise<void> => {
    if (!selectCount || selectCount <= 0) {
      alert("Please enter a valid number");
      return;
    }

    setIsLoading(true);

    try {
      const availableArtworks = data.filter(artwork => 
        !selectedArtworks.some(selected => selected.id === artwork.id)
      );
      const canSelectFromCurrentPage = Math.min(selectCount, availableArtworks.length);
      
      if (canSelectFromCurrentPage > 0) {
        const artworksToAdd = availableArtworks.slice(0, canSelectFromCurrentPage);
        const updatedSelections = [...selectedArtworks, ...artworksToAdd];
        
        setSelectedArtworks(updatedSelections);
        localStorage.setItem("selectedArtworks", JSON.stringify(updatedSelections));
      }

      if (selectCount > availableArtworks.length) {
        const remainingNeeded = selectCount - availableArtworks.length;
        alert(`Selected ${canSelectFromCurrentPage} artworks from this page. 
        Navigate to other pages and use the custom selection again to select more artworks. 
        You need ${remainingNeeded} more.`);
      } else {
        alert(`Successfully selected ${canSelectFromCurrentPage} artworks`);
      }

      setSelectCount(null);
      overlayPanelRef.current?.hide();

    } catch (error) {
      console.error("Error during custom row selection:", error);
      alert("An error occurred while selecting artworks.");
    } finally {
      setIsLoading(false);
    }
  };

  const onPageChange = (e: any) => {
    setCurPage(e.page + 1);
  };

  const renderValue = (value: any) => (value ? value : "N/A");

  const toggleOverlay = (event: React.MouseEvent) => {
    overlayPanelRef.current?.toggle(event);
  };

  // Fixed handler for InputNumber value change
  const handleInputNumberChange = (e: { value: number | null }) => {
    setSelectCount(e.value);
  };

  return (
    <div className="card">
      {data.length > 0 ? (
        <>
          <div className="selected-info">
            <div className="selection-header">
              <span>
                Selected: <strong>{selectedArtworks.length}</strong>{" "}
                {selectedArtworks.length === 1 ? "row" : "rows"}
              </span>

              <Button
                icon="pi pi-chevron-down"
                className="p-button-text p-button-sm"
                onClick={toggleOverlay}
                aria-label="Select multiple rows"
                tooltip="Select multiple rows across all pages"
                tooltipOptions={{ position: "top" }}
              />
            </div>

            <OverlayPanel
              ref={overlayPanelRef}
              className="custom-selection-panel"
              dismissable
            >
              <div className="custom-selection-content">
                <h4>Select Multiple Rows</h4>
                <p>Enter number of rows to select across all pages</p>

                <div className="selection-input-row">
                  <div className="simple-input">
                    <InputNumber
                      value={selectCount}
                      onValueChange={handleInputNumberChange}
                      placeholder="Enter number"
                      min={1}
                      max={1000}
                      showButtons={false}
                      style={{ width: "100%" }}
                      inputStyle={{ width: "100%" }}
                    />
                  </div>
                  <Button
                    label="Select"
                    onClick={handleCustomRowSelection}
                    loading={isLoading}
                    disabled={!selectCount || selectCount <= 0}
                  />
                </div>
              </div>
            </OverlayPanel>
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
            selection={selectedArtworks.filter((artwork) =>
              data.some((d) => d.id === artwork.id)
            )}
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
      ) : (
        <h1>no data found</h1>
      )}
    </div>
  );
}

export default Table;