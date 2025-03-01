import React, { useEffect, useState } from "react";
import { fetchOwnerProperties } from "../services/propertyService";
import { fetchOwnerMessages, replyToMessage, fetchUserMessages, fetchReplies } from "../services/messageService";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [messages, setMessages] = useState({});
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const propertiesData = await fetchOwnerProperties();
        setProperties(propertiesData);

        const messagesData = await fetchOwnerMessages();
        setMessages(messagesData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleReplyChange = (messageId, text) => {
    setReplyText((prev) => ({ ...prev, [messageId]: text }));
  };

  const handleReplySubmit = async (messageId) => {
    if (!replyText[messageId]) return;

    try {
      await replyToMessage(messageId, replyText[messageId]);

      setReplyText((prev) => ({ ...prev, [messageId]: "" }));

      const updatedMessages = await fetchOwnerMessages();
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error sending reply:", error.message);
    }
  };
  useEffect(() => {
    const getMessages = async () => {
      try {
        const messagesData = await fetchUserMessages();

        // Fetch replies for each message
        const messagesWithReplies = await Promise.all(
          messagesData.map(async (msg) => {
            const replies = await fetchReplies(msg._id);
            return { ...msg, replies };
          })
        );

        setMessages(messagesWithReplies);
      } catch (err) {
        setError("Failed to fetch messages.");
      }
    };
    getMessages();
  }, []);
  return (
    <div className="mt-20 mb-10 max-w-7xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Listed Properties</h1>
        <button
          onClick={() => navigate("/properties")}
          className="bg-red-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-800"
        >
          + Add Property
        </button>
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-red-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.length > 0 ? (
            properties.map((property) => (
              <div key={property._id} className="bg-white p-4 rounded-lg shadow-md">
                <img
                  src={property.photos[0].startsWith("http") ? property.photos[0] : `http://localhost:5000/uploads/${property.photos[0]}`}
                  alt={property.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />

                <h3 className="text-xl font-semibold">{property.title}</h3>
                <p className="text-gray-600">{property.city}</p>
                <p className="text-gray-800 font-semibold">${property.price}</p>
                <button
                  onClick={() => navigate(`/details/${property._id}`)}
                  className="mt-3 w-full bg-red-700 text-white py-2 rounded-lg hover:bg-red-800"
                >
                  View Details
                </button>

                {/* Messages Section */}
                <h2 className="text-lg font-semibold mt-4">Messages</h2>
                {/* {messages[property._id] && messages[property._id].length > 0 ? (
                  messages[property._id].map((msg) => (
                    <div key={msg._id} className="border p-3 my-2 rounded-lg bg-gray-50">
                      <p><strong>{msg.sender}</strong> ({msg.email}):</p>
                      <p className="text-gray-700">{msg.message}</p>
                      <p className="text-sm text-gray-500">Sent: {new Date(msg.timestamp).toLocaleString()}</p>

                    
                      <div className="mt-2 flex">
                        <input
                          type="text"
                          placeholder="Type your reply..."
                          value={replyText[msg._id] || ""}
                          onChange={(e) => handleReplyChange(msg._id, e.target.value)}
                          className="border p-2 flex-grow rounded-l-lg"
                        />
                        <button
                          onClick={() => handleReplySubmit(msg._id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No messages for this property.</p>
                )} */}
                 {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id}
              className="border p-3 my-2 rounded-lg bg-gray-50"
            >
              <p>
                <strong>Property:</strong> {msg.propertyId?.title || "Unknown"}
              </p>
              {/* <p><strong>{msg.senderId?.name || "Unknown Sender"}</strong> ({msg.senderId?.email || "No email"}):</p> */}
              <p className="text-gray-700">
                <span>
                  <strong>Your Message: </strong>{" "}
                </span>
                {msg.message}
              </p>
              <p className="text-sm text-gray-500">
                Sent: {new Date(msg.timestamp).toLocaleString()}
              </p>

              {/* Display Replies */}
              {/* {msg.replies.length > 0 && (
                <div className="mt-2 p-2 border-l-4 border-blue-500 bg-blue-50 rounded">
                  <h3 className="text-md font-semibold text-blue-600">
                    Replies:
                  </h3>
                  {msg.replies.map((reply) => (
                    <p key={reply._id} className="text-gray-800">
                      <strong>{reply.senderId?.name || "Unknown"}</strong> (
                      {reply.senderId?.email || "No email"})
                      <p> {reply.message} </p>
                      <span className="text-sm text-gray-500">
                        ({new Date(reply.timestamp).toLocaleString()})
                      </span>
                    </p>
                  ))}
                </div>
              )} */}

<h2 className="text-lg font-semibold mt-4">Messages</h2>
                {msg.replies.length > 0 ? (
                  msg.replies.map((msg) => (
                    <div key={msg._id} className="border p-3 my-2 rounded-lg bg-gray-50">
                      <p><strong>{msg.propertyId?.title}</strong> ({msg.senderId?.email }):</p>
                      <p className="text-gray-700">{msg.message}</p>
                      <p className="text-sm text-gray-500">Sent: {new Date(msg.timestamp).toLocaleString()}</p>

                      {/* Reply Input */}
                      <div className="mt-2 flex">
                        <input
                          type="text"
                          placeholder="Type your reply..."
                          value={replyText[msg._id] || ""}
                          onChange={(e) => handleReplyChange(msg._id, e.target.value)}
                          className="border p-2 flex-grow rounded-l-lg"
                        />
                        <button
                          onClick={() => handleReplySubmit(msg._id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No messages for this property.</p>
                )}
              
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No messages received.</p>
        )}
              </div>
              
            ))
          ) : (
            <p className="text-gray-500 text-center">You haven't added any properties yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
