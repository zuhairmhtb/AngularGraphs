
// Generate a Unique ID
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

//Main Module for the application
var myApp = angular.module("graph_edit_app", []);
// Service that holds the shared variables
myApp.service("GraphEditorService", function () {
    var available_graphs = []; // ID of available graphs
    this.get_available_graphs = function () {
        return available_graphs;
    };
    this.set_available_graphs = function (graph) {
        available_graphs = graph;
    };

    var available_graph_objects = []; // Highchart Objects of available graphs
    this.get_available_graph_objects = function () {
        return available_graph_objects;
    };
    this.set_available_graph_objects = function (graph_object) {
        available_graph_objects = graph_object;
    };

    var available_graph_parents = []; //Div enclosing the Highchart objects of the available graphs
    this.get_available_graph_parents = function () {
        return available_graph_parents;
    };
    this.set_available_graph_parents = function (graph) {
        available_graph_parents = graph;
    };

    var available_graph_data = []; //Data of the Highchart objects of the available graphs
    this.get_available_graph_data = function () {
        return available_graph_data;
    };
    this.set_available_graph_data = function (data) {
        available_graph_data = data;
    };

    var graph_base_div_id = "main_graph_container"; // Main container that holds all the Highchart objects of the available graphs
    this.get_base_div_id = function () {
        return graph_base_div_id;
    };
});
myApp.controller("main_controller", function ($scope, $http, GraphEditorService) {
    //Nav Controls
    $scope.plot_view = true;  // Toggle Graph Plot View
    $scope.gproperties_view = false; // Toggle Graph Properties View
    $scope.dproperties_view = false; // Toggle Data Properties View
    $scope.title = "Angular Graphs"; // App Title
    $scope.display_plot_fn = function () { // Display Graph Plot View
        console.log("Displaying Graph plots");
        $scope.plot_view = true;
        $scope.gproperties_view = false;
        $scope.dproperties_view = false;
    };
    $scope.display_graph_properties_fn = function () { // Display Graph Properties View
        console.log("Displaying Graph Properties");
        $scope.plot_view = false;
        $scope.gproperties_view = true;
        $scope.dproperties_view = false;
    };
    $scope.display_data_properties_fn = function () { // Display Data Proeprties View
        console.log("Displaying Data Properties");
        $scope.plot_view = false;
        $scope.gproperties_view = false;
        $scope.dproperties_view = true;
    };

    //Graph Create/Delete Control
    $scope.available_graphs = GraphEditorService.get_available_graphs(); // IDs of available graphs
    $scope.available_graph_objects = GraphEditorService.get_available_graph_objects(); //Objects of available Graphs
    $scope.available_graph_parents = GraphEditorService.get_available_graph_parents(); //Parent element of available graphs
    $scope.available_graph_data = GraphEditorService.get_available_graph_data(); //Data Series of available graphs
    $scope.base_div_id = GraphEditorService.get_base_div_id(); // Base parent that holds all available graph plots

    $scope.selected_graph_gcd = -1; // Selected Graph Plot
    $scope.add_graph_fn = function () { // Add new Graph

        // 1. Generate a unique ID for the graph
        available_graphs = GraphEditorService.get_available_graphs();
        graph_id = guid()
        while($("#"+graph_id).length != 0){
            graph_id = guid();
        }
        available_graphs.push(graph_id); // Add the ID to list of available graph IDs

        // 2. Create a new <div> element for holding the graph object
        graph_container = document.createElement("div");
        graph_container.setAttribute("id", graph_id);
        graph_container.style.borderBottom = "1px solid #333333";

        graph_container.onclick = function () { // Select/Deselect a Graph Plot when clicked
            for(i=0; i < available_graphs.length; i++){
                if(available_graphs[i] == $(this).attr("id")){
                    if($scope.selected_graph_gcd == i){
                        console.log("Deselected graph: " + available_graphs[$scope.selected_graph_gcd]);
                        $scope.selected_graph_gcd = -1;
                    }
                    else{
                        $scope.selected_graph_gcd = i;
                        console.log("Current selected graph: " + available_graphs[$scope.selected_graph_gcd]);
                    }
                    break;
                }
            }
            if($scope.selected_graph_gcd == -1){
                console.log("Deselected graph: " + available_graphs[$scope.selected_graph_gcd]);
            }
        }
        // 3. Add the new <div> element to parent container that holds all the graph plots
        base_container = document.getElementById($scope.base_div_id);
        base_container.appendChild(graph_container);
        available_graph_parents = GraphEditorService.get_available_graph_parents();
        available_graph_parents.push(graph_container);

        // 4. Add sample data for the new graph that is being created
        graph_data = [{"data": [10, 20, 30, 40, 50], "name": "Series 1"}, {"data": [50, 40, 30, 20, 10], "name": "Series 2"}];
        available_graph_data = GraphEditorService.get_available_graph_data();
        available_graph_data.push(graph_data);

        // 5. Create New Highchart graph inside the <div> element with default options and data

        graph = Highcharts.chart(graph_container, {  //Create new Graph inside the element
            chart: {  // Set graph attributes
                type: "bar",
                animation: {
                    duration: 1000
                }
            },
            title: {  // set graph title
                text: "Graph Title: " + graph_id,
            },
            subtitle: {
                text: "Graph Subtitle"
            },
            xAxis: {
                title: {
                    text: "X axis Title"
                },
                tickInterval: 1,
                gridLineWidth: 1
            },
            yAxis: {
                title: {
                    text: "Y axis Title"
                },
                tickInterval: 1,
                gridLineWidth: 1
            },
            series: graph_data
        });
        available_graph_objects = GraphEditorService.get_available_graph_objects();
        available_graph_objects.push(graph);

        // 6. Update new Graph status
        GraphEditorService.set_available_graphs(available_graphs);
        GraphEditorService.set_available_graph_parents(available_graph_parents);
        GraphEditorService.set_available_graph_data(available_graph_data);
        GraphEditorService.set_available_graph_objects(available_graph_objects);

        $scope.available_graphs = GraphEditorService.get_available_graphs();
        $scope.available_graph_objects = GraphEditorService.get_available_graph_objects();
        $scope.available_graph_parents = GraphEditorService.get_available_graph_parents();
        $scope.available_graph_data = GraphEditorService.get_available_graph_data();

    }
    $scope.delete_graph_fn = function () { // Delete a selected Graph
        if($scope.selected_graph_gcd >= 0 && $scope.selected_graph_gcd < GraphEditorService.get_available_graphs().length){
            available_graphs = GraphEditorService.get_available_graphs();
            available_graphs.splice($scope.selected_graph_gcd, 1); // Remove ID of the selected graph from list of available graphs
            available_graph_parents = GraphEditorService.get_available_graph_parents();
            available_graph_parents[$scope.selected_graph_gcd].outerHTML = ""; //Remove <div> element of the selected graph
            available_graph_parents.splice($scope.selected_graph_gcd, 1); // Remove <div> element reference from list of available graphs
            available_graph_objects = GraphEditorService.get_available_graph_objects();
            available_graph_objects[$scope.selected_graph_gcd].destroy(); // Destroy selected Highchart object
            available_graph_objects.splice($scope.selected_graph_gcd, 1); // Remove Highchart object from the list of available graphs
            available_graph_data = GraphEditorService.get_available_graph_data();
            available_graph_data.splice($scope.selected_graph_gcd, 1); // Remove data of the selected graph from the list of available graphs

            // Update new state of available graphs
            GraphEditorService.set_available_graphs(available_graphs);
            GraphEditorService.set_available_graph_parents(available_graph_parents);
            GraphEditorService.set_available_graph_data(available_graph_data);
            GraphEditorService.set_available_graph_objects(available_graph_objects);

            $scope.available_graphs = GraphEditorService.get_available_graphs();
            $scope.available_graph_objects = GraphEditorService.get_available_graph_objects();
            $scope.available_graph_parents = GraphEditorService.get_available_graph_parents();
            $scope.available_graph_data = GraphEditorService.get_available_graph_data();

        }
    }
    $scope.delete_all_fn = function () { //Delete all available graphs
        available_graphs = GraphEditorService.get_available_graphs();
        available_graph_parents = GraphEditorService.get_available_graph_parents();
        available_graph_objects = GraphEditorService.get_available_graph_objects();
        available_graph_data = GraphEditorService.get_available_graph_data();
        while(available_graphs.length > 0){
            available_graphs.splice(0, 1);
            available_graph_parents[0].outerHTML = "";
            available_graph_parents.splice(0, 1);
            available_graph_objects[0].destroy();
            available_graph_objects.splice(0, 1);
            available_graph_data.splice(0, 1);
        }

        GraphEditorService.set_available_graphs(available_graphs);
        GraphEditorService.set_available_graph_parents(available_graph_parents);
        GraphEditorService.set_available_graph_data(available_graph_data);
        GraphEditorService.set_available_graph_objects(available_graph_objects);

        $scope.available_graphs = GraphEditorService.get_available_graphs();
        $scope.available_graph_objects = GraphEditorService.get_available_graph_objects();
        $scope.available_graph_parents = GraphEditorService.get_available_graph_parents();
        $scope.available_graph_data = GraphEditorService.get_available_graph_data();
    };

    // Data properties Controller
    $scope.inpFrom_options = ["Random", "JSON URL", "File"]; //The formats from which data can be acquired
    $scope.selected_inpFrom_option = -1; // Current data input format
    $scope.selected_graph_dpc = -1; // Selected graph to set data
    $scope.random_data_length = 0; // Random data generation length
    $scope.random_data_series_total = 0; // Total number of series in Random data generation
    $scope.json_url=""; // URL of the path for acquiring data in Json format
    $scope.file_url=""; // URL of the file for acquiring data as File Input
    $scope.get_data_fn = function () { // Acquire and Set data to selected Graph
        available_graph_objects = GraphEditorService.get_available_graph_objects();
        available_graph_data = GraphEditorService.get_available_graph_data();
        if($scope.selected_graph_dpc >=0 && $scope.selected_graph_dpc < available_graph_objects.length){

            // 1. If data input format is selected as random, then generate random data according to the specified parameters
            if($scope.selected_inpFrom_option == 0 && $scope.random_data_length > 0 && $scope.random_data_series_total > 0){//Create Random data of length n
                total_data = [];
                // 1a. Generate specified number of series for the data
                for(j=0; j < $scope.random_data_series_total; j++){
                    random_data = [];
                    // 1ai. For each series data generate specified number of data points
                    for(i=0; i < $scope.random_data_length; i++){
                        random_data.push(Math.random());
                    }
                    // 1aii. Add the data points
                    total_data.push({
                        "data": random_data,
                        "name": "Series"+j
                    });
                }
                // 2b. Add the generated random data to the specified graph
                available_graph_data[$scope.selected_graph_dpc] = total_data;
            }
            // 2. Else if input format is selected as Json, then acuiqire data in Json format from specified URL
            else if($scope.selected_inpFrom_option == 1 && $scope.json_url.length > 0){//Get data from JSON call
                $http({
                    method : "GET",
                    url : $scope.json_url
                }).then(function mySuccess(response) {
                    available_graph_data[$scope.selected_graph_dpc] = response.data;
                }, function myError(response) {
                    console.log(response.statusText)
                });
            }
            // 3. Remove current data from the specified graph
            while(available_graph_objects[$scope.selected_graph_dpc].series.length > 0)
                available_graph_objects[$scope.selected_graph_dpc].series[0].remove(true);
            // 4. Add new data to the specified graph
            for(i=0; i < available_graph_data[$scope.selected_graph_dpc].length; i++){
                available_graph_objects[$scope.selected_graph_dpc].addSeries(available_graph_data[$scope.selected_graph_dpc][i], false);
            }
            // 5. Redraw the graph
            available_graph_objects[$scope.selected_graph_dpc].redraw();
            // 6. Update available graphs
            GraphEditorService.set_available_graph_objects(available_graph_objects);
            GraphEditorService.set_available_graph_data(available_graph_data);
            // 7. Reset Control form of data properties
            $scope.selected_inpFrom_option = -1;
            $scope.selected_graph_dpc = -1;
            $scope.random_data_length = 0;
            $scope.random_data_series_total = 0;
            $scope.json_url="";
            $scope.file_url="";

        }
        else{
            console.log("Select a Graph First");
        }

    }

    // Graph properties Control
    $scope.graph_type = ""; // Specifies the type of graph: line/bar
    $scope.graph_title = ""; // Specifies title of the selected graph
    $scope.graph_subtitle = ""; // Specifies subtitle of the selected graph
    $scope.graph_xtitle = ""; // Specifies title of x-axis of the selected graph
    $scope.graph_ytitle = ""; // Specifies title of y-axis of the selected graph
    $scope.graph_xtickinterval = 0; // Specifies tick intervals for x-axis of the selected graph
    $scope.graph_ytickinterval = 0; // Specifies tick intervals for y-axis of the selected graph
    $scope.graph_xgridwidth = 0; // Specifies grid line width for x-axis of the selected graph
    $scope.graph_ygridwidth = 0; // Specifies grid line width for x-axis of the selected graph
    $scope.selected_graph_gpc = -1; // Current selected graph for editing graph property


    $scope.set_graph_property_fn = function () { // Set graph property for a specified graph
        available_graphs = GraphEditorService.get_available_graphs();
        available_graph_objects = GraphEditorService.get_available_graph_objects();
        if($scope.selected_graph_gpc >= 0 && $scope.selected_graph_gpc < $scope.available_graphs.length){
            console.log('Setting properties to Graph: ' + $scope.selected_graph_gpc);
            // 1. Get specified update parameters for the graph property
            updated_options = {};
            if($scope.graph_type.length > 0){
                updated_options.chart = {type: $scope.graph_type};
            }

            if($scope.graph_title.length > 0){
                updated_options.title = {text: $scope.graph_title};
            }
            if($scope.graph_subtitle.length > 0){
                updated_options.subtitle = {text: $scope.graph_subtitle};
            }
            updated_xAxis = {};
            if($scope.graph_xtitle.length > 0){
                updated_xAxis.title = {text: $scope.graph_xtitle};
            }
            if($scope.graph_xtickinterval > 0){
                updated_xAxis.tickInterval = $scope.graph_xtickinterval;
            }
            if($scope.graph_xgridwidth > 0){
                updated_xAxis.gridLineWidth= $scope.graph_xgridwidth;
            }
            updated_options.xAxis = updated_xAxis;
            updated_yAxis = {};
            if($scope.graph_ytitle.length > 0){
                updated_yAxis.title = {text: $scope.graph_ytitle};
            }
            if($scope.graph_ytickinterval > 0){
                updated_yAxis.tickInterval = $scope.graph_ytickinterval;
            }
            if($scope.graph_ygridwidth > 0){
                updated_yAxis.gridLineWidth= $scope.graph_ygridwidth;
            }
            updated_options.yAxis = updated_yAxis;

            // 2. Update the selected graph with specified parameters
            console.log(updated_options);
            available_graph_objects[$scope.selected_graph_gpc].update(updated_options);

            // 3. Reset Control form for graph properties
            $scope.graph_type = "";
            $scope.graph_title = "";
            $scope.graph_subtitle = "";
            $scope.graph_xtitle = "";
            $scope.graph_ytitle = "";
            $scope.graph_xtickinterval = 0;
            $scope.graph_ytickinterval = 0;
            $scope.graph_xgridwidth = 0;
            $scope.graph_ygridwidth = 0;
            $scope.selected_graph_gpc = -1;

        }
    }
});

$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");

});
$(document).ready(function () {
    $("#add_chart_button").click(); // Generate a default graph
});