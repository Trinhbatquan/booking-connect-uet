import React from "react";

const Pagination = ({ numberOfPage,pages,handleNavigatePage }) => {
  // console.log({ numberOfPage, pages, handleNavigatePage });
  return (
    <nav aria-label="Page navigation example py-3">
      <ul class="flex items-center -space-x-px h-104 text-sm">
        <li
          onClick={() =>
            +numberOfPage > 1 && handleNavigatePage(+numberOfPage - 1)
          }
        >
          <div
            href="#"
            class={`flex items-center justify-center px-4 h-10 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${+numberOfPage === 1 ? "cursor-text" : "cursor-pointer"
              }`}
          >
            <span class="sr-only text-sm">Previous</span>
            <svg
              class="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </div>
        </li>
        {[...Array(pages).keys()]?.map((pageItem,index) => {
          return (
            <li key={index} onClick={() => handleNavigatePage(+pageItem + 1)}>
              <div
                href="#"
                class={`flex text-lg items-center cursor-pointer justify-center px-4 h-10 leading-tight  border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${+numberOfPage === +pageItem + 1
                    ? "text-gray-700 bg-gray-200"
                    : "text-gray-500 bg-white"
                  }`}
              >
                {+pageItem + 1}
              </div>
            </li>
          );
        })}
        <li
          onClick={() =>
            +numberOfPage < +pages && handleNavigatePage(+numberOfPage + 1)
          }
        >
          <div
            href="#"
            class={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ${+numberOfPage === +pages ? "cursor-text" : "cursor-pointer"
              }`}
          >
            <span class="sr-only text-sm">Next</span>
            <svg
              class="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
