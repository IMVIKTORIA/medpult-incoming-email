import React from "react";
import icons from "../../shared/icons";
import { ListColumnData, SortData } from "../CustomListTypes";

interface ListColumnProps extends ListColumnData {
  handleSortClick: any;
  sortData: SortData | undefined;
}

/** Столбец шапки таблицы */
function CustomListHeaderColumn(props: ListColumnProps) {
  const { code, fr, fixedWidth, isSortable, name, handleSortClick, sortData } =
    props;

  const isActive = sortData?.code === code;
  const isAscending = sortData?.isAscending;

  /** Переключение режима сортировки */
  const toggleSortColumn = () => {
    let data: SortData | undefined;

    if (!isActive) {
      data = new SortData({ code, isAscending: true });
    } else if (isAscending) {
      data = new SortData({ code, isAscending: false });
    } else {
      data = undefined;
    }

    handleSortClick(data);
  };

  const sortIcon = isActive ? icons.SortArrow : icons.SortArrowDefault;

  return (
    <div
      className="custom-list-header-column"
      style={fixedWidth ? { width: fixedWidth } : { flex: fr }}
    >
      <div className="custom-list-header-column__name" title={name}>
        {name}
      </div>

      {isSortable && (
        <div
          className={`custom-list-header-column__button ${
            isActive ? (isAscending ? "asc" : "desc") : "default"
          }`}
          onClick={toggleSortColumn}
        >
          {sortIcon}
        </div>
      )}
    </div>
  );
}

export default CustomListHeaderColumn;
