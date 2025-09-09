import Society from "../models/Society.js";

// 1. Create Society
export async function createSociety(req, res) {
  const {
    name,
    address,
    registrationNumber,
    owner,
    amenities,
    maintenanceFee,
    rules,
    contactDetails,
    logo,
  } = req.body;

  try {
    const society = new Society({
      name,
      address,
      registrationNumber,
      owner,
      amenities,
      maintenanceFee,
      rules,
      contactDetails,
      logo,
    });

    await society.save();
    res.status(201).json({ message: "Society created successfully", society });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 2. Get All Societies
export async function getAllSocieties(req, res) {
  try {
    const societies = await Society.find();
    res.status(200).json(societies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 3. Get Society by ID
export async function getSocietyById(req, res) {
  try {
    const society = await Society.findById(req.params.id);
    if (!society) return res.status(404).json({ error: "Society not found" });
    res.status(200).json(society);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 4. Update Society
export async function updateSociety(req, res) {
  try {
    const updatedSociety = await Society.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSociety)
      return res.status(404).json({ error: "Society not found" });
    res
      .status(200)
      .json({
        message: "Society updated successfully",
        society: updatedSociety,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 5. Delete Society
export async function deleteSociety(req, res) {
  try {
    const deletedSociety = await Society.findByIdAndDelete(req.params.id);
    if (!deletedSociety)
      return res.status(404).json({ error: "Society not found" });
    res.status(200).json({ message: "Society deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 6. Add Wing to Society
export async function addWingToSociety(req, res) {
  const { wingName } = req.body;
  try {
    const society = await Society.findById(req.params.id);
    if (!society) return res.status(404).json({ error: "Society not found" });

    society.wings.push({ wingName });
    await society.save();

    res
      .status(201)
      .json({ message: "Wing added to society", wing: { wingName } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 7. Get Wings of a Society
export async function getWingsOfSociety(req, res) {
  try {
    const society = await Society.findById(req.params.id);
    if (!society) return res.status(404).json({ error: "Society not found" });
    res.status(200).json(society.wings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 8. Add Floor to Wing
export async function addFloorToWing(req, res) {
  const { floorNumber } = req.body;
  try {
    const society = await Society.findById(req.params.societyId);
    if (!society) return res.status(404).json({ error: "Society not found" });

    const wing = society.wings.id(req.params.wingId);
    if (!wing) return res.status(404).json({ error: "Wing not found" });

    wing.floors.push({ floorNumber });
    await society.save();

    res
      .status(201)
      .json({ message: "Floor added to wing", floor: { floorNumber } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 9. Get Floors of a Wing
export async function getFloorsOfWing(req, res) {
  try {
    const society = await Society.findById(req.params.societyId);
    if (!society) return res.status(404).json({ error: "Society not found" });

    const wing = society.wings.id(req.params.wingId);
    if (!wing) return res.status(404).json({ error: "Wing not found" });

    res.status(200).json(wing.floors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 10. Add Flat to Floor
export async function addFlatToFloor(req, res) {
  const { flatNumber, unitType, status, type, rentAmount, amenities } =
    req.body;
  try {
    const society = await Society.findById(req.params.societyId);
    if (!society) return res.status(404).json({ error: "Society not found" });

    const wing = society.wings.id(req.params.wingId);
    if (!wing) return res.status(404).json({ error: "Wing not found" });

    const floor = wing.floors.find(
      (f) => f.floorNumber === req.params.floorNumber
    );
    if (!floor) return res.status(404).json({ error: "Floor not found" });

    floor.flats.push({
      flatNumber,
      unitType,
      status,
      type,
      rentAmount,
      amenities,
    });

    await society.save();

    res.status(201).json({ message: "Flat added to floor" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 11. Get Flats of a Floor
export async function getFlatsOfFloor(req, res) {
  try {
    const society = await Society.findById(req.params.societyId);
    if (!society) return res.status(404).json({ error: "Society not found" });

    const wing = society.wings.id(req.params.wingId);
    if (!wing) return res.status(404).json({ error: "Wing not found" });

    const floor = wing.floors.find(
      (f) => f.floorNumber === req.params.floorNumber
    );
    if (!floor) return res.status(404).json({ error: "Floor not found" });

    res.status(200).json(floor.flats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 12. Request to Join Flat
export async function requestToJoinFlat(req, res) {
  const { userId, wingName, floorNumber, flatNumber } = req.body;

  try {
    const society = await Society.findOne({ "wings.wingName": wingName });
    if (!society) return res.status(404).json({ error: "Society not found" });

    const wing = society.wings.find((w) => w.wingName === wingName);
    const floor = wing.floors.find((f) => f.floorNumber === floorNumber);
    const flat = floor.flats.find((f) => f.flatNumber === flatNumber);

    if (!flat) return res.status(404).json({ error: "Flat not found" });

    if (flat.isOccupied) {
      const joinRequest = {
        userId,
        status: "Pending",
      };

      flat.joinRequests.push(joinRequest);
      await society.save();

      res.status(200).json({ message: "Join request sent to family members" });
    } else {
      flat.familyMembers.push({
        userId,
        name: req.user.name, // Assuming user info comes from token/session
        relation: "Tenant",
      });
      flat.isOccupied = true;
      await society.save();
      res.status(200).json({ message: "Successfully joined the flat" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 13. Respond to Join Request
export async function respondToJoinRequest(req, res) {
  const { flatId, userId, action } = req.body;

  try {
    const society = await Society.findOne({ "wings.floors.flats._id": flatId });
    if (!society) return res.status(404).json({ error: "Society not found" });

    const wing = society.wings.find((w) =>
      w.floors.some((f) => f.flats.some((fl) => fl._id.toString() === flatId))
    );
    const floor = wing.floors.find((f) =>
      f.flats.some((fl) => fl._id.toString() === flatId)
    );
    const flat = floor.flats.find((fl) => fl._id.toString() === flatId);

    const request = flat.joinRequests.find(
      (req) => req.userId.toString() === userId.toString()
    );

    if (!request) return res.status(404).json({ error: "Request not found" });

    if (action === "accept") {
      request.status = "Accepted";
      flat.familyMembers.push({
        userId,
        name: req.user.name,
        relation: "Tenant",
      });
      flat.isOccupied = true;
    } else if (action === "reject") {
      request.status = "Rejected";
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    await society.save();
    res.status(200).json({ message: `Request ${action}ed successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 14. Get Pending Join Requests for a Flat
export async function getPendingJoinRequests(req, res) {
  const { wingName, floorNumber, flatNumber } = req.params;

  try {
    const society = await Society.findOne({ "wings.wingName": wingName });
    if (!society) return res.status(404).json({ error: "Society not found" });

    const wing = society.wings.find((w) => w.wingName === wingName);
    const floor = wing.floors.find((f) => f.floorNumber === floorNumber);
    const flat = floor.flats.find((f) => f.flatNumber === flatNumber);

    if (!flat) return res.status(404).json({ error: "Flat not found" });

    const pendingRequests = flat.joinRequests.filter(
      (request) => request.status === "Pending"
    );

    res.status(200).json(pendingRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
