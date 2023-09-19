import React, { useState, useEffect } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Ripple } from "primereact/ripple";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import moment from "moment";

import { FaEye } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";

const NotificationItem = ({ type, dataNotify, roleManager, managerId }) => {
  const [loading, setLoading] = useState(false);

  //dataTable
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [selectedProducts8, setSelectedProducts8] = useState(null);
  const [allRowSelected, setAllRowSelected] = useState(false);
  // const [currentPage, setCurrentPage] = useState();
  const [first1, setFirst1] = useState(0);
  const [rows1, setRows1] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputTooltip, setPageInputTooltip] = useState(
    "Press 'Enter' key to go to this page."
  );

  //pagination
  const paginatorLeft = (
    <Button type="button" icon="pi pi-refresh" className="p-button-text" />
  );
  const paginatorRight = (
    <Button type="button" icon="pi pi-cloud" className="p-button-text" />
  );
  const onCustomPage1 = (event) => {
    setFirst1(event.first);
    setRows1(event.rows);
    setCurrentPage(event.page + 1);
  };
  const onPageInputChange = (event) => {
    setCurrentPage(event.target.value);
  };
  const onPageInputKeyDown = (event, options) => {
    if (event.key === "Enter") {
      const page = parseInt(currentPage);
      if (page < 1 || page > options.totalPages) {
        setPageInputTooltip(
          `Value must be between 1 and ${options.totalPages}.`
        );
      } else {
        const first = currentPage ? options.rows * (page - 1) : 0;

        setFirst1(first);
        setPageInputTooltip("Press 'Enter' key to go to this page.");
      }
    }
  };
  const template1 = {
    layout:
      "PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport",
    PrevPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-3">Previous</span>
          <Ripple />
        </button>
      );
    },
    NextPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-3">Next</span>
          <Ripple />
        </button>
      );
    },
    PageLinks: (options) => {
      if (
        (options.view.startPage === options.page &&
          options.view.startPage !== 0) ||
        (options.view.endPage === options.page &&
          options.page + 1 !== options.totalPages)
      ) {
        const className = classNames(options.className, { "p-disabled": true });

        return (
          <span className={className} style={{ userSelect: "none" }}>
            ...
          </span>
        );
      }

      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
        >
          {options.page + 1}
          <Ripple />
        </button>
      );
    },
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 4, value: 4 },
        { label: 8, value: 8 },
        { label: 12, value: 12 },
        { label: "All", value: options.totalRecords },
      ];

      return (
        <Dropdown
          value={options.value}
          options={dropdownOptions}
          onChange={options.onChange}
        />
      );
    },
    CurrentPageReport: (options) => {
      return (
        <span
          className="mx-3"
          style={{ color: "var(--text-color)", userSelect: "none" }}
        >
          Go to{" "}
          <InputText
            size="2"
            className="ml-1"
            value={currentPage}
            tooltip={pageInputTooltip}
            onKeyDown={(e) => onPageInputKeyDown(e, options)}
            onChange={onPageInputChange}
          />
        </span>
      );
    },
  };

  //filter
  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      fullName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue1("");
  };
  const clearFilter1 = () => {
    initFilters1();
  };
  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1["global"].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  const renderHeader1 = () => {
    return (
      <div className="flex justify-between">
        <div className="flex items-center justify-start gap-8">
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            className="p-button-outlined"
            onClick={() => {
              clearFilter1();
              setSelectedProducts8([]);
            }}
          />
          {selectedProducts8?.length > 1 && (
            <Button
              type="button"
              // icon="pi pi-filter-slash"
              label="Delete"
              className={`p-button-outlined ${
                selectedProducts8?.length >= 1 ? "" : "disabled"
              }`}
              // onClick={() => handleDeleteManyData()}
            />
          )}
        </div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Search By Name..."
          />
        </span>
      </div>
    );
  };
  const header1 = renderHeader1();
  const actionTemplate = (rowData) => {
    // console.log(rowData);
    return (
      <div className="flex items-center justify-center gap-6">
        {rowData?.fullName === selectedProducts8[0]?.fullName && (
          <>
            <FaEye
              className="cursor-pointer text-inputColor"
              // onClick={() => isOpenUpdateUser(rowData)}
            />
            <AiOutlineDelete
              className="cursor-pointer text-blue-600"
              // onClick={() => isOpenModalDeleteUser(rowData)}
            />
          </>
        )}
      </div>
    );
  };

  const titleTemplate = (rowData) => {
    let value = "";
    if (rowData?.title === "new_schedule") {
      value = "Lịch hẹn mới.";
    } else if (rowData?.title === "new_question") {
      value = "Câu hỏi mới từ sinh viên.";
    } else {
      value = "Cuộc hẹn sắp diễn ra.";
    }
    return <span>{value}</span>;
  };

  const contentTemplate = (rowData) => {
    let value = [];
    if (rowData?.title === "new_schedule") {
      value.push(`Bạn có một lịch hẹn trao đổi mới với sinh viên.`);
      value.push(`Vấn đề trao đổi: ${rowData?.bookingData.reason}`);
      value.push(
        `Thời gian: ${moment(rowData.bookingData.date).format(
          "dddd - DD/MM/YYYY"
        )}`
      );
    } else if (rowData?.title === "new_question") {
      value.push(`Bạn có một câu hỏi mới từ sinh viên.`);
      value.push(`Vấn đề: ${rowData?.bookingData?.subject}`);
      value.push(
        `Thời gian đặt câu hỏi: ${moment(rowData.bookingData.createdAt).format(
          "dddd - DD/MM/YYYY"
        )}`
      );
    } else {
      value.push(`Bạn có một cuộc họp trao đổi sắp diễn ra với sinh viên.`);
      value.push(`Vấn đề trao đổi: ${rowData?.bookingData.reason}`);
      value.push(
        `Thời gian: ${moment(rowData.bookingData.date).format(
          "dddd - DD/MM/YYYY"
        )}`
      );
    }
    return (
      <div className="flex flex-col items-start">
        <p>{value[0]}</p>
        <p>{value[1]}</p>
        <p>{value[2]}</p>
      </div>
    );
  };

  return (
    <>
      <div
        className="mt-3 flex flex-col items-start mx-auto pb-5 gap-8"
        style={{ maxWidth: "80%", width: "80%" }}
      >
        {dataNotify?.length === 0 ? null : (
          <div className="w-full mt-8">
            <DataTable
              value={dataNotify}
              paginator
              responsiveLayout="scroll"
              paginatorTemplate={template1}
              first={first1}
              rows={rows1}
              onPage={onCustomPage1}
              rowsPerPageOptions={[10, 20, 30]}
              paginatorLeft={paginatorLeft}
              paginatorRight={paginatorRight}
              filters={filters1}
              filterDisplay="menu"
              globalFilterFields={[""]}
              header={header1}
              emptyMessage="No customers found."
              selectionMode="checkbox"
              selection={selectedProducts8}
              onSelectionChange={(e) => setSelectedProducts8(e.value)}
              resizableColumns
              columnResizeMode="fit"
              showGridlines
              onAllRowsSelect={(e) => setAllRowSelected(e)}
              onAllRowsUnselect={() => setAllRowSelected(false)}
              // dataKey="id"
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "3em" }}
              ></Column>
              <Column header="Chủ đề" body={titleTemplate}></Column>
              <Column header="Nội dung" body={contentTemplate}></Column>

              {selectedProducts8 && selectedProducts8?.length === 1 && (
                <Column body={actionTemplate} header="Hành động"></Column>
              )}
            </DataTable>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationItem;
