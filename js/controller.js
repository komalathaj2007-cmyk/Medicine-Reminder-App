
app.controller("MedicineController", function ($scope, $http) {


    // ==========================
    // User Details
    // ==========================

    var savedName =
        localStorage.getItem("medmate_username") || "User";

    var savedEmail =
        localStorage.getItem("medmate_email") || "user@email.com";


    $scope.user = {

        name: savedName,

        email: savedEmail,

        phone: "+91 9876543210",

        country: "India"

    };



    // ==========================
    // Load Medicines from MySQL
    // ==========================

    $scope.medicines = [];


    $http.get(
        "http://localhost:3000/medicines"
    )

    .then(function (response) {

        $scope.medicines = response.data;

    })

    .catch(function (error) {

        console.log(
            "Error loading medicines:",
            error
        );


        // Load old localStorage data
        // if database is unavailable

        if (localStorage.getItem("medicines")) {

            $scope.medicines =
                JSON.parse(
                    localStorage.getItem("medicines")
                );

        }

    });



    // ==========================
    // Dashboard Counts
    // ==========================

    $scope.totalMedicine = function () {

        return $scope.medicines.length;

    };


    $scope.completedMedicine = function () {

        var count = 0;


        angular.forEach(
            $scope.medicines,
            function (medicine) {

                if (
                    medicine.status == "Completed"
                ) {

                    count++;

                }

            }
        );


        return count;

    };


    $scope.upcomingMedicine = function () {

        var count = 0;


        angular.forEach(
            $scope.medicines,
            function (medicine) {

                if (
                    medicine.status == "Upcoming"
                ) {

                    count++;

                }

            }
        );


        return count;

    };


    $scope.pendingMedicine = function () {

        var count = 0;


        angular.forEach(
            $scope.medicines,
            function (medicine) {

                if (
                    medicine.status == "Pending"
                ) {

                    count++;

                }

            }
        );


        return count;

    };



    // ==========================
    // Add Medicine to MySQL
    // ==========================

    $scope.addMedicine = function () {


        var formattedTime = "";


        if ($scope.time) {


            var hours =
                $scope.time.getHours();


            var minutes =
                $scope.time.getMinutes();


            var ampm =
                hours >= 12
                    ? "PM"
                    : "AM";


            hours =
                hours % 12;


            if (hours === 0) {

                hours = 12;

            }


            if (minutes < 10) {

                minutes =
                    "0" + minutes;

            }


            formattedTime =
                hours +
                ":" +
                minutes +
                " " +
                ampm;

        }



        // Data sent to MySQL

        var medicineData = {

            medicine_name:
                $scope.name,

            dosage:
                $scope.dose,

            time:
                formattedTime,

            frequency:
                $scope.frequency,

            notes:
                $scope.notes || ""

        };



        // Send data to Node.js backend

        $http.post(

            "http://localhost:3000/medicines",

            medicineData

        )

        .then(function (response) {


            console.log(
                response.data
            );


            alert(
                "Medicine Added Successfully!"
            );



            // Clear Form

            $scope.name = "";

            $scope.category = "";

            $scope.dose = "";

            $scope.frequency = "";

            $scope.date = "";

            $scope.time = "";

            $scope.notes = "";



            // Go to dashboard

            window.location.href =
                "dashboard.html";

        })


        .catch(function (error) {


            console.log(
                "Error:",
                error
            );


            alert(
                "Error! Medicine was not saved to database."
            );

        });

    };



    // ==========================
    // Delete Medicine
    // ==========================

    $scope.deleteMedicine = function (index) {


        $scope.medicines.splice(
            index,
            1
        );


        localStorage.setItem(

            "medicines",

            JSON.stringify(
                $scope.medicines
            )

        );

    };



    // ==========================
    // Complete Medicine
    // ==========================

    $scope.completeMedicine = function (medicine) {


        medicine.status =
            "Completed";


        localStorage.setItem(

            "medicines",

            JSON.stringify(
                $scope.medicines
            )

        );

    };



    // ==================================================
    // EDIT MEDICINE
    // ==================================================


    // ==========================
    // Open Edit Popup
    // ==========================

    $scope.openEditMedicine = function (medicine) {


        // Make a copy so the original
        // medicine is not changed until
        // Save Changes is clicked.

        $scope.editingMedicine =
            angular.copy(medicine);

    };



    // ==========================
    // Close Edit Popup
    // ==========================

    $scope.closeEditMedicine = function () {


        $scope.editingMedicine =
            null;

    };



    // ==========================
    // Save Edited Medicine
    // ==========================

    $scope.updateMedicine = function () {


        var medicine =
            $scope.editingMedicine;



        // Make sure a medicine
        // has actually been selected.

        if (
            !medicine ||
            !medicine.id
        ) {

            alert(
                "Invalid medicine selected."
            );

            return;

        }



        // Data that will be updated
        // in the existing MySQL row.

        var updatedMedicine = {

            medicine_name:
                medicine.medicine_name,

            dosage:
                medicine.dosage,

            time:
                medicine.time,

            frequency:
                medicine.frequency,

            notes:
                medicine.notes || ""

        };



        // Send UPDATE request
        // to Node.js backend.

        $http.put(

            "http://localhost:3000/medicines/" +
            medicine.id,

            updatedMedicine

        )

        .then(function (response) {


            console.log(
                response.data
            );


            alert(
                "Medicine updated successfully!"
            );



            // Update the medicine displayed
            // on the dashboard.

            angular.forEach(

                $scope.medicines,

                function (item) {


                    if (
                        item.id === medicine.id
                    ) {


                        item.medicine_name =
                            medicine.medicine_name;


                        item.dosage =
                            medicine.dosage;


                        item.time =
                            medicine.time;


                        item.frequency =
                            medicine.frequency;


                        item.notes =
                            medicine.notes;

                    }

                }

            );



            // Close popup

            $scope.editingMedicine =
                null;

        })


        .catch(function (error) {


            console.log(
                "Update error:",
                error
            );


            alert(
                "Medicine could not be updated."
            );

        });

    };


});
