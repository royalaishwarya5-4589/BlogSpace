
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isRegister, setIsRegister] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    category: "Technology"
  });

  const [commentInputs, setCommentInputs] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // LOAD ALL BLOGS
  const loadBlogs = async () => {
    try {
      const response = await fetch(`${API}/blogs`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load blogs.");
      }

      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      setMessage(error.message || "Cannot connect to the server.");
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // REGISTER AND LOGIN
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const endpoint = isRegister ? "register" : "login";

      const response = await fetch(`${API}/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed.");
      }

      if (isRegister) {
        setMessage("Account created successfully! Please log in.");
        setIsRegister(false);
        setForm({
          name: "",
          email: form.email,
          password: ""
        });
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);

        setForm({
          name: "",
          email: "",
          password: ""
        });

        setMessage("Welcome back!");
      }
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken("");
    setUser(null);

    setMessage("You have logged out successfully.");
  };

  // CREATE OR UPDATE BLOG
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        editingId
          ? `${API}/blogs/${editingId}`
          : `${API}/blogs`,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(blogForm)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save blog.");
      }

      setMessage(data.message);

      setBlogForm({
        title: "",
        content: "",
        category: "Technology"
      });

      setEditingId(null);

      await loadBlogs();
    } catch (error) {
      setMessage(error.message || "Unable to save blog.");
    }
  };

  // EDIT BLOG
  const handleEdit = (blog) => {
    setEditingId(blog._id);

    setBlogForm({
      title: blog.title,
      content: blog.content,
      category: blog.category || "General"
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // DELETE BLOG
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete blog.");
      }

      setMessage(data.message);
      await loadBlogs();
    } catch (error) {
      setMessage(error.message || "Unable to delete blog.");
    }
  };

  // ADD COMMENT
  const handleCommentSubmit = async (e, blogId) => {
    e.preventDefault();

    const text = (commentInputs[blogId] || "").trim();

    if (!text) {
      setMessage("Please write a comment first.");
      return;
    }

    try {
      const response = await fetch(
        `${API}/blogs/${blogId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ text })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to add comment.");
      }

      setCommentInputs((previous) => ({
        ...previous,
        [blogId]: ""
      }));

      setMessage("Comment posted successfully!");

      await loadBlogs();
    } catch (error) {
      setMessage(error.message || "Unable to add comment.");
    }
  };

  // CANCEL BLOG EDITING
  const cancelEditing = () => {
    setEditingId(null);

    setBlogForm({
      title: "",
      content: "",
      category: "Technology"
    });
  };

  return (
    <div className="app">

      {/* NAVIGATION */}
      <header className="navbar">
        <a className="logo" href="#home">
          BlogSpace<span>.</span>
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#blogs">Explore Blogs</a>

          {user ? (
            <>
              <span className="welcome">
                Hi, {user.name}
              </span>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <a href="#account" className="nav-login">
              Login
            </a>
          )}
        </nav>
      </header>

      <main>

        {/* HERO SECTION */}
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">
              YOUR IDEAS. YOUR STORIES.
            </p>

            <h1>
              Every story deserves <span>a space.</span>
            </h1>

            <p className="hero-description">
              Share your thoughts, explore new perspectives,
              and connect with a community of passionate writers.
            </p>

            <a
              href={user ? "#write" : "#account"}
              className="primary-btn"
            >
              Start Writing →
            </a>
          </div>

          <div className="hero-decoration">
            B.
          </div>
        </section>

        {/* NOTIFICATION */}
        {message && (
          <div className="message" role="status">
            <span>{message}</span>

            <button
              onClick={() => setMessage("")}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        )}

        {/* LOGIN AND REGISTRATION */}
        {!user && (
          <section className="account-section" id="account">

            <div className="section-heading">
              <p className="eyebrow">
                JOIN OUR COMMUNITY
              </p>

              <h2>
                {isRegister
                  ? "Create your account"
                  : "Welcome back"}
              </h2>

              <p>
                {isRegister
                  ? "Sign up to start sharing your stories."
                  : "Log in to create and manage your blogs."}
              </p>
            </div>

            <form
              className="account-form"
              onSubmit={handleAuth}
            >
              {isRegister && (
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value
                    })
                  }
                  minLength="2"
                  required
                />
              )}

              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value
                  })
                }
                required
              />

              <input
                type="password"
                placeholder="Password (minimum 6 characters)"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value
                  })
                }
                minLength="6"
                required
              />

              <button
                className="primary-btn full-btn"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : isRegister
                    ? "Create Account"
                    : "Login"}
              </button>
            </form>

            <p className="switch-auth">
              {isRegister
                ? "Already have an account?"
                : "New to BlogSpace?"}

              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister
                  ? "Login"
                  : "Create an account"}
              </button>
            </p>
          </section>
        )}

        {/* CREATE BLOG SECTION */}
        {user && (
          <section className="write-section" id="write">

            <div className="section-heading">
              <p className="eyebrow">
                SHARE YOUR THOUGHTS
              </p>

              <h2>
                {editingId
                  ? "Edit your story"
                  : "Create a new blog"}
              </h2>

              <p>
                Turn your ideas into something worth reading.
              </p>
            </div>

            <form
              className="blog-form"
              onSubmit={handleBlogSubmit}
            >
              <input
                type="text"
                placeholder="Enter your blog title"
                value={blogForm.title}
                onChange={(e) =>
                  setBlogForm({
                    ...blogForm,
                    title: e.target.value
                  })
                }
                minLength="3"
                maxLength="150"
                required
              />

              <select
                value={blogForm.category}
                onChange={(e) =>
                  setBlogForm({
                    ...blogForm,
                    category: e.target.value
                  })
                }
              >
                <option>Technology</option>
                <option>Education</option>
                <option>Lifestyle</option>
                <option>Travel</option>
                <option>General</option>
              </select>

              <textarea
                placeholder="Write your story here..."
                value={blogForm.content}
                onChange={(e) =>
                  setBlogForm({
                    ...blogForm,
                    content: e.target.value
                  })
                }
                rows="7"
                required
              />

              <div className="form-actions">
                <button className="primary-btn">
                  {editingId
                    ? "Update Blog"
                    : "Publish Blog"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        {/* BLOG LIST */}
        <section className="blogs-section" id="blogs">

          <div className="section-heading">
            <p className="eyebrow">
              DISCOVER IDEAS
            </p>

            <h2>Latest Stories</h2>

            <p>
              Explore what our community is writing about.
            </p>
          </div>

          <div className="blog-grid">

            {blogs.length === 0 ? (
              <p className="empty-state">
                No blogs published yet.
                Be the first to share a story!
              </p>
            ) : (
              blogs.map((blog) => (
                <article
                  className="blog-card"
                  key={blog._id}
                >

                  <span className="category">
                    {blog.category || "General"}
                  </span>

                  <h3>{blog.title}</h3>

                  <p className="blog-content">
                    {blog.content}
                  </p>

                  <div className="blog-footer">
                    <span>
                      By {blog.author?.name || "Unknown"}
                    </span>

                    <span>
                      {new Date(
                        blog.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  {/* BLOG OWNER ACTIONS */}
                  {user &&
                    blog.author?._id === user.id && (
                      <div className="card-actions">
                        <button
                          onClick={() => handleEdit(blog)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(blog._id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    )}

                  {/* PROFESSIONAL COMMENTS SECTION */}
                  <div className="comments-section">

                    <div className="comments-heading">
                      <div>
                        <span className="comments-eyebrow">
                          COMMUNITY
                        </span>

                        <h4>Discussion</h4>
                      </div>

                      <span className="comments-count">
                        {blog.comments?.length || 0} comments
                      </span>
                    </div>

                    {/* EXISTING COMMENTS */}
                    {blog.comments?.length > 0 ? (
                      <div className="comments-list">

                        {blog.comments.map((comment) => {
                          const authorName =
                            comment.user?.name || "Reader";

                          const initials = authorName
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();

                          return (
                            <div
                              className="comment-item"
                              key={comment._id}
                            >

                              <div className="comment-avatar">
                                {initials}
                              </div>

                              <div className="comment-body">

                                <div className="comment-meta">
                                  <strong>
                                    {authorName}
                                  </strong>

                                  <span>
                                    {comment.createdAt
                                      ? new Date(
                                          comment.createdAt
                                        ).toLocaleString()
                                      : ""}
                                  </span>
                                </div>

                                <p>{comment.text}</p>

                              </div>
                            </div>
                          );
                        })}

                      </div>
                    ) : (
                      <div className="empty-comments">
                        <span className="empty-comments-icon">
                          ✎
                        </span>

                        <strong>
                          Start the conversation
                        </strong>

                        <p>
                          Be the first to share your thoughts
                          on this story.
                        </p>
                      </div>
                    )}

                    {/* ADD COMMENT */}
                    {user ? (
                      <form
                        className="comment-form"
                        onSubmit={(e) =>
                          handleCommentSubmit(e, blog._id)
                        }
                      >
                        <div className="comment-input-area">

                          <textarea
                            placeholder="Share your thoughts with the community..."
                            value={
                              commentInputs[blog._id] || ""
                            }
                            onChange={(e) =>
                              setCommentInputs((previous) => ({
                                ...previous,
                                [blog._id]: e.target.value
                              }))
                            }
                            maxLength="1000"
                            rows="3"
                            required
                          />

                          <div className="comment-form-footer">
                            <span>
                              {
                                (commentInputs[blog._id] || "")
                                  .length
                              }/1000
                            </span>

                            <button type="submit">
                              Post Comment →
                            </button>
                          </div>

                        </div>
                      </form>
                    ) : (
                      <p className="login-to-comment">
                        Please log in to join the discussion.
                      </p>
                    )}

                  </div>
                </article>
              ))
            )}

          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <a className="logo" href="#home">
          BlogSpace<span>.</span>
        </a>

        <p>
          Share your story. Inspire the world.
        </p>

        <p className="copyright">
          © 2026 BlogSpace. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

export default App;

