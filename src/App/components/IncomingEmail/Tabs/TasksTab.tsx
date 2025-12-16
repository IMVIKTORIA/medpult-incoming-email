import React, { useEffect, useState, useCallback } from "react";
import TaskList, { TaskListProps } from "../../TaskList/TaskList.tsx";
import TabItem from "../../../../UIKit/Tabs/TabItem/TabItem.tsx";
import Scripts from "../../../shared/utils/clientScripts.ts";

interface TasksTab extends TaskListProps {
  code: string;
}

/** Список обращений */
export default function TasksTab(props: TaskListProps) {
  const {
    selectedRequestsIds,
    selectedInsuredIds,
    contractorsSearchData,
    selectedContractorsIds,
    setSelectedTasksIds,
    selectedTasksIds,
  } = props;

  //Состояние слайдера
  const [sliderActive, setSliderActive] = useState(false);
  // Общее количество задач
  const [taskCount, setTaskCount] = useState<number>(0);

  const effectiveInsuredIds = contractorsSearchData?.globalInsuredId
    ? [contractorsSearchData.globalInsuredId]
    : selectedInsuredIds;

  // Обновить общее количество задач
  async function updateTaskCount() {
    if (
      !contractorsSearchData?.globalInsuredId &&
      !selectedContractorsIds.length
    ) {
      setTaskCount(0);
      return;
    }
    const count = await Scripts.getCountTask(
      selectedContractorsIds,
      contractorsSearchData,
      sliderActive
    );
    setTaskCount(count);
  }

  // Количество отфильтрованных задач
  const [filteredTasksCount, setFilteredTasksCount] = useState<number>(0);
  // Обновление количества отфильтрованных по обращениям задач
  async function updateFilteredTaskCount() {
    if (
      !selectedRequestsIds?.length &&
      !effectiveInsuredIds?.length &&
      !selectedContractorsIds.length
    ) {
      setFilteredTasksCount(0);
      return;
    }
    // При выбранном обращении получить количество задач по этому обращению с указанными фильтрами
    const count = await Scripts.getFilteredTasksCount(
      selectedContractorsIds,
      selectedRequestsIds,
      effectiveInsuredIds,
      contractorsSearchData,
      sliderActive
    );
    setFilteredTasksCount(count);
  }

  // Обновить количества
  async function updateCounts() {
    await updateTaskCount();
    await updateFilteredTaskCount();
  }
  
  async function updateSelectedTasks() {
    // Если показаны закрыте задачи, то не сбрасывать
    if(sliderActive) return;

    // Фильтрация от закрытых задач
    const notClosedRequests = await Scripts.filterClosedTasks(selectedTasksIds);

    setSelectedTasksIds(notClosedRequests);
  }

  const handleUpdate = async() => {
    setIsLoadingCounts(true);

    await updateCounts();
    // await updateSelectedTasks();

    setIsLoadingCounts(false);
  }

  const handleUpdateSelectedTasks = async() => {
    setIsLoadingSelectedIds(true);

    await updateSelectedTasks();

    setIsLoadingSelectedIds(false);
  }

  // При изменении выбранного обращения, фильтров или общего количества задач
  useEffect(() => {
    handleUpdate()
  }, [
    selectedRequestsIds,
    contractorsSearchData,
    selectedInsuredIds,
    selectedContractorsIds,
    sliderActive,
  ]);

  useEffect(() => {
    handleUpdateSelectedTasks()
  },[
    sliderActive
  ])

  const [isLoadingCounts, setIsLoadingCounts] = useState<boolean>(true);
  const [isLoadingSelectedIds, setIsLoadingSelectedIds] = useState<boolean>(true);

  const isLoading = isLoadingSelectedIds || isLoadingCounts;
  function getCountString(count: number) {
    return isLoading ? "--" : `${count}`;
  }

  const countTitle = (
    <span className="count">
      {getCountString(
        effectiveInsuredIds?.length || selectedRequestsIds?.length
          ? filteredTasksCount
          : taskCount
      )}
    </span>
  );
  // Вкладка задачи
  return (
    <TabItem code={"tasks"} name={<>Задачи {countTitle}</>}>
      <TaskList
        {...props}
        sliderActive={sliderActive}
        setSliderActive={setSliderActive}
      />
    </TabItem>
  );
}
