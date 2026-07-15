const calculateAge = require('../utils/ageCalc');

module.exports = (PersonModel) => {
  return {
    
    getAll: (req, res) => {
      const currentUserId = req.user.id;

      PersonModel.findAllByUserId(currentUserId, (err, rows) => {
        if (err) {
          return res.status(500).json({ error: "Failed to fetch persons" });
        }

        
        const processedRows = rows.map(row => ({
          ...row,
          age: calculateAge(row.dob)
        }));

        return res.status(200).json(processedRows);
      });
    },


    getById: (req, res) => {
      const currentUserId = req.user.id;
      const targetId = req.params.id;

      PersonModel.findById(targetId, currentUserId, (err, row) => {
        if (err) {
          return res.status(500).json({ error: "Failed to fetch person" });
        }
        if (!row) {
          return res.status(404).json({ error: "Person not found" });
        }

        
        const processedPerson = {
          ...row,
          age: calculateAge(row.dob)
        };

        return res.status(200).json(processedPerson);
      });
    },

    
    create: (req, res) => {
      const currentUserId = req.user.id;
      const { firstname, lastname, dob, sex } = req.body;

      
      if (!firstname || !lastname || !dob) {
        return res.status(400).json({ error: "Missing required fields: firstname, lastname, dob" });
      }

      const personData = {
        user_id: currentUserId,
        firstname,
        lastname,
        dob,
        sex: sex || 'unknown'
      };

      PersonModel.create(personData, (err, insertionId) => {
        if (err) {
          return res.status(500).json({ error: "Failed to create person" });
        }

        return res.status(200).json({
          id: insertionId,
          firstname,
          lastname,
          dob,
          sex: personData.sex,
          age: calculateAge(dob)
        });
      });
    },

    
    update: (req, res) => {
      const currentUserId = req.user.id;
      const targetId = req.params.id;
      const { firstname, lastname, dob, sex } = req.body;

      if (!firstname || !lastname || !dob) {
        return res.status(400).json({ error: "Missing required fields: firstname, lastname, dob" });
      }

      const updateData = { firstname, lastname, dob, sex: sex || 'unknown' };

      PersonModel.update(targetId, currentUserId, updateData, (err, changesCount) => {
        if (err) {
          return res.status(500).json({ error: "Failed to update person" });
        }
        if (changesCount === 0) {
          return res.status(404).json({ error: "Person not found" });
        }

        return res.status(200).json({ message: "Person updated successfully" });
      });
    },

    
    delete: (req, res) => {
      const currentUserId = req.user.id;
      const targetId = req.params.id;

      PersonModel.delete(targetId, currentUserId, (err, changesCount) => {
        if (err) {
          return res.status(500).json({ error: "Failed to delete person" });
        }
        if (changesCount === 0) {
          return res.status(404).json({ error: "Person not found" });
        }

        return res.status(200).json({ message: "Person deleted successfully" });
      });
    }
  };
};