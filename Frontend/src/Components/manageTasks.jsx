import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
import { MDBBtn, MDBSpinner } from "mdb-react-ui-kit";
import toast, { Toaster } from "react-hot-toast";
import { Modal, Button, Form } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function ManageTasks() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDue, setFilterDue] = useState("all");

  const [formTask, setFormTask] = useState({
    title: "",
    description: "",
    deadline: "",
    category_id: "",
  });

  const user = Cookies.get("user");
  const userId = user ? JSON.parse(user).id : null;

  useEffect(() => {
    if (!userId) return;
    document.body.className =
      Cookies.get("mode") === "light" ? "light-mode" : "dark-mode";
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/task/get/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );
      const data = await res.json();
      if (data.success) setTasks(data.tasks);
      else toast.error("Failed to fetch tasks.");
    } catch (err) {
      toast.error("Error fetching tasks.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/category/get/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (err) {
      toast.error("Error fetching categories.");
    }
  };

  const handleAddTask = async () => {
    if (
      !formTask.title ||
      !formTask.description ||
      !formTask.deadline ||
      !formTask.category_id
    ) {
      toast.error("All fields are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/task/create/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
          body: JSON.stringify(formTask),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Task created");
        fetchTasks();
        setShowAddModal(false);
        setFormTask({
          title: "",
          description: "",
          deadline: "",
          category_id: "",
        });
      } else toast.error("Failed to create task.");
    } catch (err) {
      toast.error("Error creating task.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/task/update/${selectedTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
          body: JSON.stringify(formTask),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Task updated");
        fetchTasks();
        setShowEditModal(false);
        setSelectedTask(null);
        setFormTask({
          title: "",
          description: "",
          deadline: "",
          category_id: "",
        });
      } else toast.error("Update failed.");
    } catch (err) {
      toast.error("Error updating task.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/task/delete/${selectedTask.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Task deleted");
        setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
        setShowDeleteModal(false);
        setSelectedTask(null);
      } else toast.error("Delete failed.");
    } catch (err) {
      toast.error("Error deleting task.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/task/toggleTaskStatus/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
          body: JSON.stringify({ is_completed: !task.is_completed }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Task status updated");
        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id ? { ...t, is_completed: !t.is_completed } : t
          )
        );
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  return (
    <div className="siderow">
      <Toaster position="top-center" />
      <div className="sidecol1">
        <Sidebar />
      </div>
      <div className="sidecol2">
        <div className="d-flex justify-content-between align-items-center mt-4">
          <h1 className="dashboard fw-bold">My Tasks</h1>
          <MDBBtn
            onClick={() => {
              setFormTask({
                title: "",
                description: "",
                deadline: "",
                category_id: "",
              });
              setShowAddModal(true);
            }}
            style={{
              height: "50px",
              marginTop: "3%",
              backgroundColor: "#563d7c",
              color: "#fff",
              borderRadius: "0",
            }}
          >
            + Add Task
          </MDBBtn>
        </div>

        <div className="d-flex flex-column flex-md-row gap-3 mt-4">
          <Form.Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="shadow-sm rounded"
            style={{ width: "100%", padding: "12px",
                  fontSize: "14px",maxWidth: "250px" }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            value={filterDue}
            onChange={(e) => setFilterDue(e.target.value)}
            className="shadow-sm rounded"
            style={{ width: "100%", padding: "12px",
                  fontSize: "14px",maxWidth: "250px" }}
          >
            <option value="all">All Deadlines</option>
            <option value="upcoming">Upcoming</option>
            <option value="overdue">Overdue</option>
          </Form.Select>
        </div>

        <div
          className="relative overflow-x-auto shadow-md sm:rounded-lg"
          style={{ marginTop: "30px" }}
        >
          {loading ? (
            <div className="text-center py-5">
              <MDBSpinner color="primary" />
            </div>
          ) : (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead
                className="uppercase"
                style={{ padding: "10px", color: "#313a50" }}
              >
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Deadline</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Completed</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks
                  .filter((task) => {
                    const deadline = new Date(task.deadline);
                    const now = new Date();

                    if (filterDue === "upcoming" && deadline < now)
                      return false;
                    if (filterDue === "overdue" && deadline >= now)
                      return false;
                    if (filterCategory && task.category_id !== filterCategory)
                      return false;
                    return true;
                  })
                  .map((task, i) => (
                    <tr className="border-b" key={task.id}>
                      <td className="px-6 py-4 font-medium">{i + 1}</td>
                      <td className="px-6 py-4">{task.title}</td>
                      <td
                        className="px-6 py-4"
                        style={{
                          whiteSpace: "pre-wrap",
                          wordWrap: "break-word",
                          maxWidth: "300px",
                        }}
                      >
                        {task.description}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(task.deadline).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          style={{
                            backgroundColor: task.Category.color_code,
                            color: "#fff",
                            padding: "4px 10px",
                            borderRadius: 5,
                          }}
                        >
                          {task.Category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle text-center">
                        <div className="flex justify-center items-center h-full">
                          <Form.Check
                            type="checkbox"
                            checked={task.is_completed}
                            onChange={() => toggleTaskStatus(task)}
                          />
                        </div>
                      </td>

                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <FaEdit
                            size={18}
                            style={{ cursor: "pointer", color: "#007bff" }}
                            title="Edit"
                            onClick={() => {
                              setSelectedTask(task);
                              setFormTask({
                                title: task.title,
                                description: task.description,
                                deadline: task.deadline.slice(0, 16),
                                category_id: task.category_id,
                              });
                              setShowEditModal(true);
                            }}
                          />
                          <FaTrash
                            size={18}
                            style={{ cursor: "pointer", color: "#dc3545" }}
                            title="Delete"
                            onClick={() => {
                              setSelectedTask(task);
                              setShowDeleteModal(true);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add/Edit Modal */}
        <Modal
          show={showAddModal || showEditModal}
          onHide={() => {
            setShowAddModal(false);
            setShowEditModal(false);
          }}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{showAddModal ? "Add Task" : "Edit Task"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formTask.title}
                style={{
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "14px",
                }}
                onChange={(e) =>
                  setFormTask((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formTask.description}
                style={{
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "14px",
                }}
                onChange={(e) =>
                  setFormTask((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="datetime-local"
                value={formTask.deadline}
                style={{
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "14px",
                }}
                onChange={(e) =>
                  setFormTask((prev) => ({ ...prev, deadline: e.target.value }))
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={formTask.category_id}
                style={{
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "14px",
                }}
                onChange={(e) =>
                  setFormTask((prev) => ({
                    ...prev,
                    category_id: e.target.value,
                  }))
                }
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: "#563d7c" }}
              onClick={showAddModal ? handleAddTask : handleUpdateTask}
            >
              {submitting ? (
                <MDBSpinner size="sm" />
              ) : showAddModal ? (
                "Add"
              ) : (
                "Update"
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Modal */}
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete{" "}
            <strong>{selectedTask?.title}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteTask}>
              {submitting ? <MDBSpinner size="sm" /> : "Delete"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
