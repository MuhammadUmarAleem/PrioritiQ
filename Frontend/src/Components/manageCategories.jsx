import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { MDBBtn, MDBSpinner } from "mdb-react-ui-kit";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { Modal, Button, Form } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formCategory, setFormCategory] = useState({ name: "", color_code: "#000" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.body.className = Cookies.get("mode") === "light" ? "light-mode" : "dark-mode";
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const user = Cookies.get("user");
      if (!user) return;
      const userId = JSON.parse(user).id;

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/category/get/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      } else {
        toast.error("Failed to fetch categories.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching categories.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/category/delete/${selectedCategory.id}`,
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
        toast.success("Category deleted.");
        setCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id));
      } else {
        toast.error(data.message || "Delete failed.");
      }
    } catch (err) {
      toast.error("Error deleting category.");
    } finally {
      setShowDeleteModal(false);
      setSelectedCategory(null);
      setSubmitting(false);
    }
  };

  const handleAddCategory = async () => {
    const user = Cookies.get("user");
    if (!user) return toast.error("User not found");

    const userId = JSON.parse(user).id;

    if (!formCategory.name) return toast.error("Category name is required.");
    setSubmitting(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/category/create/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify(formCategory),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Category created.");
        setCategories(prev => [...prev, data.category]);
        setShowAddModal(false);
        setFormCategory({ name: "", color_code: "#563d7c" });
      } else {
        toast.error(data.message || "Failed to create category.");
      }
    } catch (error) {
      toast.error("Error creating category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;
    setSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/category/update/${selectedCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
          body: JSON.stringify(formCategory),
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success("Category updated.");
        setCategories(prev =>
          prev.map(cat => (cat.id === selectedCategory.id ? data.category : cat))
        );
        setShowEditModal(false);
        setSelectedCategory(null);
        setFormCategory({ name: "", color_code: "#563d7c" });
      } else {
        toast.error(data.message || "Update failed.");
      }
    } catch (err) {
      toast.error("Error updating category.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="siderow">
      <Toaster position="top-center" />
      <div className="sidecol1">
        <Sidebar />
      </div>
      <div className="sidecol2">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1 className="dashboard" style={{ paddingTop: "40px", fontWeight: "bolder" }}>
            My Categories
          </h1>
          <MDBBtn
            onClick={() => {
              setFormCategory({ name: "", color_code: "#563d7c" });
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
            + Add Category
          </MDBBtn>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg" style={{ marginTop: "30px" }}>
          {loading ? (
            <div className="text-center py-5">
              <MDBSpinner color="primary" />
            </div>
          ) : (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="uppercase" style={{ padding: "10px", color: "#313a50" }}>
                <tr>
                  <th className="px-6 py-3">Sr</th>
                  <th className="px-6 py-3">Category Name</th>
                  <th className="px-6 py-3">Color Code</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((item, index) => (
                  <tr className="border-b" key={item.id}>
                    <td className="px-6 py-4 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">
                      <span
                        style={{
                          backgroundColor: item.color_code,
                          padding: "4px 10px",
                          color: "#fff",
                          borderRadius: "5px",
                        }}
                      >
                        {item.color_code}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-3">
                      <FaEdit
                        size={20}
                        style={{ cursor: "pointer", color: "#007bff" }}
                        title="Edit"
                        onClick={() => {
                          setSelectedCategory(item);
                          setFormCategory({ name: item.name, color_code: item.color_code });
                          setShowEditModal(true);
                        }}
                      />
                      <FaTrash
                        size={18}
                        style={{ cursor: "pointer", color: "#dc3545" }}
                        title="Delete"
                        onClick={() => confirmDelete(item)}
                      />
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Delete Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete category <strong>{selectedCategory?.name}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>
              {submitting ? <MDBSpinner size="sm" /> : "Delete"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Add Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add New Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={formCategory.name}
                style={{
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "14px",
                }}
                onChange={(e) =>
                  setFormCategory(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter category name"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Pick Color</Form.Label>
              <Form.Control
                type="color"
                value={formCategory.color_code}
                onChange={(e) =>
                  setFormCategory(prev => ({ ...prev, color_code: e.target.value }))
                }
                style={{ width: "100px" }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button style={{ backgroundColor: "#563d7c" }} onClick={handleAddCategory}>
              {submitting ? <MDBSpinner size="sm" /> : "Add"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={formCategory.name}
                style={{
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "14px",
                }}
                onChange={(e) =>
                  setFormCategory(prev => ({ ...prev, name: e.target.value }))
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Pick Color</Form.Label>
              <Form.Control
                type="color"
                value={formCategory.color_code}
                onChange={(e) =>
                  setFormCategory(prev => ({ ...prev, color_code: e.target.value }))
                }
                style={{ width: "100px" }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button style={{ backgroundColor: "#563d7c" }} onClick={handleUpdateCategory}>
              {submitting ? <MDBSpinner size="sm" /> : "Update"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
