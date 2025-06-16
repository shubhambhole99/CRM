

import React, { useState, useEffect } from "react";

const Projectwise = ({ projects, users, tasks, buckets, Task }) => {
    const [sortOrder, setSortOrder] = useState("desc");
    const [sortedUsers, setSortedUsers] = useState(users);
    const [viewType, setViewType] = useState("buckets"); // New state to toggle between tasks and buckets
    const Today = new Date().toISOString().split("T")[0];
    const [filterDate, setFilterDate] = useState(Today); // State for filtering buckets by date
    const [dateordeadline,setdateordeadline]=useState("deadline")

    useEffect(() => {
        if (sortOrder === "normal") {
            setSortedUsers(users);
            return;
        }

        const userTaskCounts = users.map(user => ({
            ...user,
            taskCount: viewType === "tasks"
                ? tasks.filter(task => task.assignTaskTo.includes(user._id)).length
                : buckets.filter(bucket => bucket.user._id === user._id && (!filterDate || new Date(bucket.date).toLocaleDateString() === new Date(filterDate).toLocaleDateString()))
                    .reduce((count, bucket) => count + bucket.tasks.length, 0)
        }));

        const sorted = [...userTaskCounts].sort((a, b) => {
            return sortOrder === "desc" ? b.taskCount - a.taskCount : a.taskCount - b.taskCount;
        });

        setSortedUsers(sorted);
    }, [users, tasks, buckets, sortOrder, viewType, filterDate]);

    return (
        <>
            <h1>UserWise</h1>
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
                {sortedUsers.map((user) => (
                    <div style={{ marginRight: "3%" }} key={user._id}>
                        <strong>{user.username} ({viewType === "tasks"
                            ? tasks.filter(task => task.assignTaskTo.includes(user._id)).length
                            : buckets?.filter(bucket => bucket?.user._id === user._id && (!filterDate || new Date(bucket?.date).toLocaleDateString() === new Date(filterDate).toLocaleDateString()))
                                .reduce((count, bucket) => count + bucket.tasks.length, 0)} tasks)</strong>

                        {viewType === "tasks" ? (
                            tasks
                            .filter((task) => task.assignTaskTo.includes(user._id))
                                .map((task) => (
                                    <Task task={task} />
                                ))
                        ) : (
                            buckets?.filter((bucket) => bucket?.user?._id === user._id && (!filterDate || new Date(bucket?.date).toLocaleDateString() === new Date(filterDate).toLocaleDateString()))
                                .map((bucket) => (
                                    <>
                                        {bucket?.tasks?.map(task => {
                                            const tasku = tasks.find(t => t._id === task._id);
                                            return (<Task key={tasku?._id} task={tasku} />);
                                        })}
                                    </>
                                ))
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Projectwise;
