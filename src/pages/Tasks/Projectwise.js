import React, { useState, useEffect } from "react";

const Projectwise = ({ projects, users, tasks, buckets,Task,addtask }) => {
    const [sortOrder, setSortOrder] = useState("desc");
    const [sortedProjects, setSortedProjects] = useState(projects);
    const [viewType, setViewType] = useState("tasks"); // New state to toggle between tasks and buckets
    const Today = new Date().toISOString().split("T")[0];
    const [filterDate, setFilterDate] = useState(Today); // State for filtering buckets by date
    const [dateordeadline,setdateordeadline]=useState("deadline")
    useEffect(() => {
        if (sortOrder === "normal") {
            setSortedProjects(projects);
            return;
        }
        // console.log(projects)

        const projectTaskCounts = projects.map(project => ({
            ...project,
            taskCount: viewType === "tasks"
                ? tasks.filter(task => task.projectid === project._id).length
                : buckets.filter(bucket => bucket.projectId === project._id && (!filterDate || new Date(bucket.date).toLocaleDateString() === new Date(filterDate).toLocaleDateString()))
                    .reduce((count, bucket) => count + bucket.tasks.length, 0)
        }));
        // console.log(projectTaskCounts);

        const sorted = [...projectTaskCounts].sort((a, b) => {
            return sortOrder === "desc" ? b.taskCount - a.taskCount : a.taskCount - b.taskCount;
        });

        setSortedProjects(sorted);
    }, [projects, tasks, buckets, sortOrder, viewType, filterDate]);

    return (
        <>
            <h1>ProjectWise</h1>
            <div style={{ display: "flex", gap: "20px" }}>
                <div>
                    <label>View: </label>
                    <select value={viewType} onChange={(e) => setViewType(e.target.value)}>
                        <option value="tasks">Tasks</option>
                        <option value="buckets">Buckets</option>
                    </select>
                </div>
                <div>
                    <label>Sort by Task Count: </label>
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="normal">Normal</option>
                        <option value="desc">Highest First</option>
                        <option value="asc">Lowest First</option>
                    </select>
                </div>
              
                {viewType === "buckets" && (
                    <>
                        <div>
                            <label>Filter by Date: </label>
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => {
                                    console.log(e.target.value)
                                    setFilterDate(e.target.value)
                                }}
                            />
                        </div>
                        <div>
                            <label>Clear Date </label>
                            <button onClick={() => setFilterDate(null)}>Clear</button>
                        </div>
                    </>
                )}
            </div>

            <div style={{ display: "flex", flexDirection: "row", marginTop: "20px" }}>
                {sortedProjects.map((project) => (
                    <div style={{ marginRight: "3%" }} key={project._id}>
                        <strong>{project.name} 
                            
                            ({viewType === "tasks"
                            ? tasks.filter(task => task.projectid === project._id).length
                            : buckets.filter(bucket => bucket.projectId === project._id && (!filterDate || new Date(bucket.date).toLocaleDateString() === new Date(filterDate).toLocaleDateString()))
                                .reduce((count, bucket) => count + bucket.tasks.length, 0)} tasks)
                                
                                <button onClick={(e)=>addtask(project._id)}>Add Task</button></strong>

                        {viewType === "tasks" ? (
                            tasks.filter((task) => task.projectid === project._id)
                                .map((task) => (
                               <Task key={task._id} task={task}/>
                                ))
                        ) : (
                            buckets.filter((bucket) => bucket.projectId === project._id && (!filterDate || new Date(bucket.date).toLocaleDateString() === new Date(filterDate).toLocaleDateString()))
                                .map((bucket) => (
                                    <div key={bucket._id} style={{ width: "300px", border: "1px solid grey", fontSize: "18px", fontWeight: "bold", marginTop: "5px" }}>
                                        {bucket.tasks.map(task => (
                                            <pre key={task._id} style={{ whiteSpace: "pre-wrap" }}>{task.taskDescription}</pre>
                                        ))}
                                    </div>
                                ))
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Projectwise;
