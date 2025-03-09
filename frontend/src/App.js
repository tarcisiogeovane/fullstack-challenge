import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateDelivery from "./pages/CreateDelivery";
import UpdateDelivery from "./pages/UpdateDelivery";
import DeleteDelivery from "./pages/DeleteDelivery";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateDelivery />} />
      <Route path="/update/:id" element={<UpdateDelivery />} />
      <Route path="/delete/:id" element={<DeleteDelivery />} />
    </Routes>
  );
}

export default App;
