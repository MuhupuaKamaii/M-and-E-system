import { useEffect, useState } from "react";
import axios from "axios";

function FocusAreaDropdown({ focusAreas, selectedFocusArea, setSelectedFocusArea }) {
  return (
    <select
      value={selectedFocusArea}
      onChange={(e) => setSelectedFocusArea(e.target.value)}
      required
    >
      <option value="">-- Select Focus Area --</option>
      {focusAreas.map((fa) => (
        <option key={fa.focus_area_id} value={fa.focus_area_id}>
          {fa.name}
        </option>
      ))}
    </select>
  );
}

export default FocusAreaDropdown;
