sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ndc/BarcodeScanner",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, BarcodeScanner, Fragment, Filter, FilterOperator) {
        "use strict";
        var empDataPush = {
            "AppName": "",
            "Date": "",
            "EmployeeID": "",
            "EmployeeName": "",
            "CostCenter": "",
            "InTime": "",
            "OutTime": "",
            "ActualInOutHrs": "",
            "Position": "",
            "PositionManagerName": "",
            "PositionManagerEmail": "",
            "ManagerApprovalName": "",
            "ManagerApprovalEmail": "",
            "PersonnelSubArea": "",
            "SaveSubmitStatus": " ",
            "TotalHours": "",
            "PlannedStartTime": "",
            "CompanyID": "",
            "CompanyName": "",
            "PayPeriodBeginDate": "",
            "PayPeriodEndDate": "",
            "OtThreshold": "",
            "OtFrequency": "",
            "LocationCode": "",
            "PayCode": ""
        };
        var startKioskTime;
        var finishKioskTime;
        var col;
        var formattedDate;
        var plannedStartTimeInSec;
        var payPeriodStartDate;
        var payPeriodEndDate;
        var companyCode;
        var companyName;
        var Ot_Threshold;
        var PositionManagerEmail;
        var PersonnelSubArea;
        var Ot_Frequency,
            LocationCode;
        return Controller.extend("com.mgc.esgdriverkioskprd.esgkioskuiprd.controller.main", {
            onInit: function () {
                const d = new Date();
                const y = d.getFullYear().toString();
                var m = (d.getMonth() + 1).toString();
                var day = d.getDate().toString();
                if (day.length === 1) {
                    day = "0" + day;
                }
                if (m.length === 1) {
                    m = "0" + m;
                }
                const fulldate = m + '-' + day + '-' + y;
                formattedDate = y + '-' + m + '-' + day;
                console.log(formattedDate);
                var dateField = this.getView().byId("idDatePicker");
                dateField.setValue(fulldate);

                //SF Call for PayPeriod
                var sfModel = this.getOwnerComponent().getModel("v2");
                var sfFilter = [];
                var payGroup = new sap.ui.model.Filter('PayCalendar_payGroup', 'EQ', 'MGBWLY');
                sfFilter.push(payGroup)
                sfModel.read("/PayPeriod", {
                    filters: sfFilter,
                    success: function (odata) {
                        console.log("OnInit SF PayPeriod Read")
                        var payPeriodData = odata.results;
                        console.log(payPeriodData);
                        var i, flag, cDate = new Date();
                        var PpStartDate, PpEndDate;
                        for (i = 0; i < payPeriodData.length; i++) {
                            // var startDate = new Date(payPeriodData[i].payPeriodBeginDate.toLocaleDateString().replaceAll("/", "-"));
                            // var endDate = new Date(payPeriodData[i].payPeriodEndDate.toLocaleDateString().replaceAll("/", "-"));

                            var splitDate = payPeriodData[i].cust_MGCPayPeriodBeginDate.split("-");
                            var Tempdate = Number(splitDate[2]);
                            var Tempmonth = Number(splitDate[1]) - Number(1);
                            var Tempyear = Number(splitDate[0]);
                            var startDate = new Date(Tempyear, Tempmonth, Tempdate);

                            var splitDate = payPeriodData[i].cust_MGCPayPeriodEndDate.split("-");
                            var Tempdate = Number(splitDate[2]);
                            var Tempmonth = Number(splitDate[1]) - Number(1);
                            var Tempyear = Number(splitDate[0]);
                            var endDate = new Date(Tempyear, Tempmonth, Tempdate);

                            // var startDate = payPeriodData[i].payPeriodBeginDate;
                            // var endDate = payPeriodData[i].payPeriodEndDate;

                            if (cDate >= startDate && cDate <= endDate) {
                                flag = "X";
                                PpStartDate = payPeriodData[i].cust_MGCPayPeriodBeginDate;
                                PpEndDate = payPeriodData[i].cust_MGCPayPeriodEndDate;
                                break;
                            }
                        }
                        if (flag === "X") {
                            // var globalData = this.getView().getModel().getData();
                            // payPeriodStartDate = payPeriodData[i].payPeriodBeginDate.toLocaleString().split("/")[2].split(",")[0] + "-" + payPeriodData[i].payPeriodBeginDate.toLocaleString().split("/")[0] + "-" + payPeriodData[i].payPeriodBeginDate.toLocaleString().split("/")[1];

                            // var startDate = payPeriodData[i].payPeriodBeginDate;
                            // var month1 = Number(payPeriodData[i].payPeriodBeginDate.getMonth()) + Number(1);
                            // payPeriodStartDate = payPeriodData[i].payPeriodBeginDate.getFullYear() + "-" + month1 + "-" + payPeriodData[i].payPeriodBeginDate.getDate();
                            // payPeriodEndDate = payPeriodData[i].payPeriodEndDate.getFullYear() + "-" + month1 + "-" + payPeriodData[i].payPeriodEndDate.getDate();

                            // var payStart = payPeriodStartDate.split(/[-]+/);
                            // var payStartMonthLength = payStart[1].length;
                            // if (payStartMonthLength === 1) {
                            //     payStart[1] = "0" + payStart[1];
                            // }
                            // var payStartDayLength = payStart[2].length;
                            // if (payStartDayLength === 1) {
                            //     payStart[2] = "0" + payStart[2];
                            // }
                            // payPeriodStartDate = payStart[0] + "-" + payStart[1] + "-" + payStart[2];

                            // var payEnd = payPeriodEndDate.split(/[-]+/);
                            // var payEndMonthLength = payStart[1].length;
                            // if (payEndMonthLength === 1) {
                            //     payEnd[1] = "0" + payEnd[1];
                            // }
                            // var payEndDayLength = payEnd[2].length;
                            // if (payEndDayLength === 1) {
                            //     payEnd[2] = "0" + payEnd[2];
                            // }
                            // payPeriodEndDate = payEnd[0] + "-" + payEnd[1] + "-" + payEnd[2];

                            payPeriodStartDate = PpStartDate;
                            payPeriodEndDate = PpEndDate;
                            console.log("PP Start Date: " + PpStartDate);
                            console.log("PP End Date: " + PpEndDate);

                        } else {
                            payPeriodStartDate = "";
                            payPeriodEndDate = "";
                        }

                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                });

                //Work Detail table model initialization
                var emptyArr1 = [];
                var oworkTable = this.getView().byId("workDetailTab");
                var oworkModel = new sap.ui.model.json.JSONModel();
                oworkModel.setData(emptyArr1);
                oworkTable.setModel(oworkModel);

                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/Employees_prd", {
                    success: function (odata) {
                        console.log("OnInit Read")
                        console.log(odata.results);
                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                });

                var that = this;

                var oModel1 = this.getOwnerComponent().getModel();
                var filter = [];
                var AppName = new sap.ui.model.Filter('AppName', 'EQ', 'ESG');
                filter.push(AppName);

                oModel1.read("/TimeSheetDetails_prd", {
                    filters: filter,
                    success: function (odata) {
                        console.log("OnInit TimeSheet Read")
                        var tempdata = odata.results;
                        // tempdata.sort();
                        console.log(tempdata.sort((a, b) => {
                            if (a.InTime < b.InTime)
                                return -1;
                            if (a.InTime < b.InTime)
                                return 1;
                            return 0;
                        }));
                        console.log(tempdata);
                        // that.ID = odata.results[0].ID;
                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                });

                //SF OData Call for CostCenter F4
                var that = this;
                sap.ui.core.BusyIndicator.show(0);
                var oModel3 = this.getOwnerComponent().getModel("v2");
                var companycodefilter = [];
                var esgCC = "6002";
                var legalEntity = new sap.ui.model.Filter('legalEntity', 'EQ', esgCC);
                companycodefilter.push(legalEntity);
                oModel3.read("/FOCostCenter", {
                    filters: companycodefilter,
                    success: function (odata) {
                        console.log("OnInit SF Read")
                        console.log(odata.results);
                        var oCcModel = new sap.ui.model.json.JSONModel(odata);
                        that.getView().setModel(oCcModel, "costCentre");
                        sap.ui.core.BusyIndicator.hide();
                    },
                    error: function (oError) {
                        console.log(oError);
                    }
                });
                var sfModel = this.getOwnerComponent().getModel("v2");
                var sPath = "/WorkScheduleDayModelAssignmentSegment(WorkScheduleDayModelAssignment_day=1L,WorkSchedule_externalCode='MG_WORK',externalCode='1')?$format=JSON"
                sfModel.read(sPath, {
                    async: false,
                    success: function (oData) {
                        console.log("Planned Start Date");
                        console.log(oData);
                        plannedStartTimeInSec = this.get_Hours_From_Seconds(oData.startTime.ms);
                        console.log(oData.startTime.ms);
                        console.log(plannedStartTimeInSec);
                    }.bind(this),
                    error: function (oError) {
                        var sMsg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(sMsg);
                    }.bind(this)
                });

                var oLabel = this.getView().byId("digiClk");
                var result = this.GetClock();
                oLabel.setText(result);
                var that = this;
                setInterval(function () {
                    var result = that.GetClock();
                    oLabel.setText(result);
                }, 1000);
            },
            openScan: function (oEvent) {
                var that = this;
                var scanEmpId;
                var temp;
                var empData;
                var oView = this.getView();
                var oTable = oView.byId("workDetailTab").getItems()[0];
                var oModel = this.getOwnerComponent().getModel();
                var oModel2 = this.getOwnerComponent().getModel();
                var oModel3 = this.getOwnerComponent().getModel();
                BarcodeScanner.scan(
                    function (mResult) {
                        temp = mResult.text.toString();
                        if (temp.length <= 7) {
                            scanEmpId = temp;
                        }
                        else {
                            scanEmpId = temp.substring(0, 7);
                        }
                        var oFilter = [];
                        oFilter.push(new sap.ui.model.Filter('ID', 'EQ', scanEmpId));
                        oModel.read("/Employees_prd", {
                            filters: oFilter,
                            success: function (odata) {
                                console.log("Pass!");
                                empData = odata.results;
                                if (empData.length !== 0) {
                                    oView.byId("empId").setValue(empData[0].ID);
                                    var FullName = empData[0].FirstName + " " + empData[0].LastName;
                                    oView.byId("empName").setValue(FullName);
                                    oView.byId("posman").setValue(empData[0].PositionManagerFullName);
                                    oView.byId("position").setValue(empData[0].JobTitle);
                                    oView.byId("scanBtn").setEnabled(false);
                                    companyCode = empData[0].CompanyCode;
                                    companyName = empData[0].CompanyName;
                                    PositionManagerEmail = empData[0].PositionManagerEmail;
                                    PersonnelSubArea = empData[0].PersonnelSubArea;
                                    Ot_Frequency = empData[0].Ot_Frequency;
                                    LocationCode = empData[0].LocationCode;
                                    Ot_Threshold = empData[0].Ot_Threshold;
                                    if (empData[0].PositionManagerID === "") {
                                        oView.byId("posman").setValue("");
                                        sap.ui.core.BusyIndicator.hide();
                                    }
                                    else {
                                        var Filter = [];
                                        Filter.push(new sap.ui.model.Filter('ID', 'EQ', empData[0].PositionManagerID));
                                        oModel3.read("/Employees_prd", {
                                            filters: Filter,
                                            success: function (odata) {
                                                console.log("Postion Manager")
                                                console.log(odata.results);
                                                var PosManData = odata.results;
                                                if (PosManData.length !== 0) {
                                                    var FullName = PosManData[0].FirstName + " " + PosManData[0].LastName;
                                                    oView.byId("posman").setValue(FullName);
                                                    sap.ui.core.BusyIndicator.hide();
                                                }
                                                else if (PosManData.length === 0) {
                                                    oView.byId("posman").setValue("");
                                                    sap.ui.core.BusyIndicator.hide();
                                                }

                                            },
                                            error: function (oError) {
                                                console.log("Postion Manager Failed");
                                            }
                                        });
                                    }

                                    var ccModelData = that.getView().getModel("costCentre").getData();
                                    var ccData = ccModelData.results;
                                    console.log("Cost Centre Model Data");
                                    console.log(ccData);
                                    var DefCcNo;
                                    var DefCostCentreData = ccData.filter((items) => {
                                        return items.costcenterExternalObjectID == empData[0].CostCenter;
                                    });
                                    if (DefCostCentreData.length !== 0) {
                                        DefCcNo = DefCostCentreData[0].description + "-" + DefCostCentreData[0].costcenterExternalObjectID;
                                    }
                                    else {
                                        DefCcNo = empData[0].CostCenter;
                                    }
                                    var timeSheetFilter = [];
                                    var headerDate = oView.byId("idDatePicker").getValue();
                                    var AppName = new sap.ui.model.Filter('AppName', 'EQ', 'ESG');
                                    timeSheetFilter.push(AppName);
                                    var Date = new sap.ui.model.Filter('Date', 'EQ', formattedDate);
                                    timeSheetFilter.push(Date);
                                    var EmpId = new sap.ui.model.Filter('EmployeeID', 'EQ', empData[0].ID);
                                    timeSheetFilter.push(EmpId);
                                    oModel2.read("/TimeSheetDetails_prd", {
                                        filters: timeSheetFilter,
                                        success: function (oData) {
                                            console.log("Time Success");
                                            var timeData = oData.results;
                                            timeData.sort((a, b) => {
                                                if (a.InTime < b.InTime)
                                                    return -1;
                                                if (a.InTime < b.InTime)
                                                    return 1;
                                                return 0;
                                            });
                                            if (timeData.length === 0) {
                                                var wkTable1 = oView.byId("workDetailTab").getModel().getProperty("/");
                                                console.log("Empty Record , Need to push one empty row !");
                                                // var cclen = empData[0].CostCenter.length;
                                                // var ccNo = empData[0].CostCenter.substring(4, cclen);
                                                var addWork2 = {
                                                    "costcenter": DefCcNo,
                                                    "ccedit": true,
                                                    "punchin": true,
                                                    "btn1type": "Critical",
                                                    "punchintime": "",
                                                    "punchout": false,
                                                    "btn2type": "Critical",
                                                    "punchouttime": "",
                                                    "hours": "",
                                                    "actual": ""
                                                };
                                                wkTable1.push(addWork2);
                                                var wkTable2 = oView.byId("workDetailTab");
                                                wkTable2.getModel().setProperty("/", wkTable1);
                                            }
                                            else {
                                                console.log("Data Record , Need to bind to table !");
                                                console.log(timeData);
                                                var addWorkTab = {};
                                                var ccNo = empData[0].CostCenter;
                                                var newWorkRow = {
                                                    "costcenter": DefCcNo,
                                                    "ccedit": true,
                                                    "punchin": true,
                                                    "btn1type": "Critical",
                                                    "punchintime": "",
                                                    "punchout": false,
                                                    "btn2type": "Critical",
                                                    "punchouttime": "",
                                                    "hours": "",
                                                    "actuals": ""
                                                };
                                                var length = timeData.length;
                                                var newRowFlag;
                                                var wkTable1 = oView.byId("workDetailTab").getModel().getProperty("/");
                                                var lastRow = length - 1;
                                                var timeAdd = "00:00";
                                                for (var i = 0; i < length; i++) {

                                                    var ccNo;
                                                    var costCentreData = ccData.filter((items) => {
                                                        return items.costcenterExternalObjectID == timeData[i].CostCenter;
                                                    });
                                                    if (costCentreData.length !== 0) {
                                                        ccNo = costCentreData[0].description + "-" + costCentreData[0].costcenterExternalObjectID;
                                                    }
                                                    else {
                                                        ccNo = timeData[i].CostCenter;
                                                    }

                                                    addWorkTab.costcenter = ccNo;
                                                    addWorkTab.ccedit = false;
                                                    if (timeData[i].InTime === "") {
                                                        addWorkTab.punchin = true;
                                                        addWorkTab.btn1type = "Critical";
                                                        addWorkTab.punchintime = " ";
                                                    }
                                                    else {
                                                        addWorkTab.punchin = false;
                                                        addWorkTab.btn1type = "Success";
                                                        addWorkTab.punchintime = timeData[i].InTime;
                                                    }
                                                    if (timeData[i].OutTime === "") {
                                                        addWorkTab.punchout = true;
                                                        addWorkTab.btn2type = "Critical";
                                                        addWorkTab.punchouttime = " ";
                                                    }
                                                    else {
                                                        addWorkTab.punchout = false;
                                                        addWorkTab.btn2type = "Success";
                                                        addWorkTab.punchouttime = timeData[i].OutTime;
                                                        if (lastRow === i) {
                                                            newRowFlag = 1;
                                                        }
                                                    }
                                                    var temp = {};
                                                    addWorkTab.hours = timeData[i].TotalHours;
                                                    if (timeData[i].TotalHours != "") {
                                                        addWorkTab.actuals = timeData[i].ActualInOutHrs + " " + "Hrs";
                                                        timeAdd = that.addTimes(timeAdd, timeData[i].ActualInOutHrs);
                                                    }
                                                    else {
                                                        addWorkTab.actuals = "";
                                                    }
                                                    temp = addWorkTab;
                                                    wkTable1.push(temp);
                                                    addWorkTab = {};
                                                    temp = {};
                                                }
                                                if (newRowFlag === 1) {
                                                    wkTable1.push(newWorkRow);
                                                }
                                                oView.byId("totHours").setText(timeAdd + " Hrs");
                                                var wkTable2 = oView.byId("workDetailTab");
                                                wkTable2.getModel().setProperty("/", wkTable1);
                                            }
                                        },
                                        error: function (oError) {
                                            console.log("Time Failure");
                                        }
                                    });
                                }
                                else {
                                    var msg = "Invalid Employee ID";
                                    sap.m.MessageBox.show(msg, {
                                        icon: sap.m.MessageBox.Icon.ERROR,
                                        title: "Error"
                                    });
                                }
                            },
                            error: function (oError) {
                                console.log("Failure");
                            }
                        });
                    },
                    function (Error) {
                        alert("Scanning failed: " + Error);
                    },
                    function (mParams) {
                        // alert("Value entered: " + mParams.newValue);
                    },
                    "Enter ID",  //Dialog Title
                    true,        //preferFrontCamera
                    30,          //frameRate
                    1,           //zoom
                    true         //keepCameraScan
                );

            },
            punchInTime: function (oEvent) {

                var that = this;
                var oView = this.getView();
                var costCentre = oEvent.getSource().getParent().getCells()[0].getValue();
                var msg;
                if (costCentre === "") {
                    msg = "Please Select Service Line";
                    sap.m.MessageBox.show(msg, {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: "Error"
                    });
                }
                else {
                    var oModel = this.getOwnerComponent().getModel();
                    var oModel1 = this.getOwnerComponent().getModel();
                    var timeSheetFilter = [];

                    var headerDate = oView.byId("idDatePicker").getValue();
                    var AppName = new sap.ui.model.Filter('AppName', 'EQ', 'ESG');
                    timeSheetFilter.push(AppName);

                    // var Date = new sap.ui.model.Filter('Date', 'EQ', headerDate);
                    var Date = new sap.ui.model.Filter('Date', 'EQ', formattedDate);
                    timeSheetFilter.push(Date);

                    var EmployeeID = oView.byId("empId").getValue();
                    var EmpId = new sap.ui.model.Filter('EmployeeID', 'EQ', EmployeeID);
                    timeSheetFilter.push(EmpId);
                    oModel1.read("/TimeSheetDetails_prd", {
                        filters: timeSheetFilter,
                        success: function (odata) {
                            console.log("Punch In TimeSheet Read")
                            var tempdata = odata.results;
                            if (tempdata.length === 0) {
                                var punchInButton = oEvent.getSource().getParent().getCells()[1];
                                var startTime = oEvent.getSource().getParent().getCells()[2];
                                punchInButton.setEnabled(false);
                                punchInButton.setType("Success");
                                var punchInTime = that.getCurrentTime();
                                startTime.setValue(punchInTime[1]);
                                startKioskTime = punchInTime[1];

                                var AppName = "ESG"
                                var Date = formattedDate;
                                var EmployeeID = oView.byId("empId").getValue();
                                var EmployeeName = oView.byId("empName").getValue();

                                var ccFullText = oEvent.getSource().getParent().getCells()[0].getValue();
                                var sepFlag = ccFullText.includes("-");
                                if (sepFlag === true) {
                                    var ccSepIndex = ccFullText.lastIndexOf("-");
                                    var CostCenter = ccFullText.slice(ccSepIndex + 1);
                                }
                                else {
                                    var CostCenter = ccFullText;
                                }
                                var InTime = punchInTime[1];
                                var Position = oView.byId("position").getValue();
                                var PositionManager = oView.byId("posman").getValue();
                                var SaveSubmitStatus = "Saved";

                                empDataPush.AppName = AppName;
                                empDataPush.Date = Date;
                                empDataPush.EmployeeID = EmployeeID;
                                empDataPush.EmployeeName = EmployeeName;
                                empDataPush.CostCenter = CostCenter;
                                empDataPush.InTime = InTime;
                                empDataPush.ActualInOutHrs = startKioskTime;
                                empDataPush.Position = Position;
                                empDataPush.PositionManagerName = PositionManager;
                                empDataPush.PositionManagerEmail = PositionManagerEmail;
                                empDataPush.ManagerApprovalName = PositionManager;
                                empDataPush.ManagerApprovalEmail = PositionManagerEmail;
                                empDataPush.PersonnelSubArea = PersonnelSubArea;
                                empDataPush.SaveSubmitStatus = SaveSubmitStatus;
                                empDataPush.PlannedStartTime = plannedStartTimeInSec;
                                empDataPush.CompanyID = companyCode;
                                empDataPush.CompanyName = companyName;
                                empDataPush.PayPeriodBeginDate = payPeriodStartDate;
                                empDataPush.PayPeriodEndDate = payPeriodEndDate;
                                empDataPush.OtThreshold = Ot_Threshold;
                                empDataPush.OtFrequency = Ot_Frequency;
                                empDataPush.LocationCode = LocationCode;
                                empDataPush.PayCode = "";
                                oModel.create("/TimeSheetDetails_prd",
                                    empDataPush,
                                    {
                                        success: function (odata) {
                                            console.log("Post Success");
                                            sap.m.MessageToast.show("Punch In Success", {
                                                duration: 3000
                                            });
                                            setTimeout(function () {
                                                that.clearData();
                                            }.bind(that), 4000);

                                        },
                                        error: function (oError) {
                                            console.log("Post Fail");
                                            console.log(oError);
                                            var msg = "Error Occured";
                                            sap.m.MessageBox.show(msg, {
                                                icon: sap.m.MessageBox.Icon.ERROR,
                                                title: "Error"
                                            });
                                        }
                                    });
                            }
                            else {
                                tempdata.sort((a, b) => {
                                    if (a.InTime < b.InTime)
                                        return -1;
                                    if (a.InTime < b.InTime)
                                        return 1;
                                    return 0;
                                });
                                var lastRow = tempdata.length - 1;
                                var lastRowData = tempdata[lastRow];
                                // var lastPunchOut = lastRowData.OutTime.split(":");
                                // var lastPunchOutMin = parseInt(lastPunchOut[1].split(" ")[0]);
                                var lastPunchOutHr = parseInt(lastRowData.OutTime.split(":")[0]);
                                var lastPunchOutMin = parseInt(lastRowData.OutTime.split(":")[1]);


                                var punchInButton = oEvent.getSource().getParent().getCells()[1];
                                var startTime = oEvent.getSource().getParent().getCells()[2];

                                var punchInTime = that.getCurrentTime();
                                // var newPunchIn = punchInTime[0].split(":");
                                // var newPunchInMin = parseInt(newPunchIn[1].split(" ")[0]);
                                var newPunchInHr = parseInt(punchInTime[1].split(":")[0]);
                                var newPunchInMin = parseInt(punchInTime[1].split(":")[1]);

                                var hourDiff = newPunchInHr - lastPunchOutHr;
                                var hourFlag;
                                if (hourDiff === 0 || hourDiff === 1) {
                                    hourFlag = 1;
                                } else {
                                    hourFlag = 0;
                                }
                                if (hourFlag === 1) {
                                    var mindiff = newPunchInMin - lastPunchOutMin;
                                    if (mindiff <= 5) {
                                        punchInButton.setEnabled(false);
                                        punchInButton.setType("Success");
                                        startTime.setValue(lastRowData.OutTime);

                                        // var temp = lastRowData.OutTime.split(":");
                                        // var temp2 = parseInt(temp[0]);
                                        // var temp3 = temp[1].split(" ")[1];
                                        // var temp4;
                                        // var temp5;
                                        // if (temp3 === "PM") {
                                        //     temp4 = temp2 + 12;
                                        //     temp5 = temp4.toString() + ":" + temp[1].split(" ")[0];
                                        //     startKioskTime = temp5;
                                        //     var InTime = lastRowData.OutTime;
                                        // }
                                        // else {
                                        //     startKioskTime = lastRowData.OutTime.split(" ");
                                        //     var InTime = lastRowData.OutTime;
                                        // }

                                        startKioskTime = lastRowData.OutTime;
                                        var InTime = lastRowData.OutTime;
                                    } else {
                                        punchInButton.setEnabled(false);
                                        punchInButton.setType("Success");

                                        startTime.setValue(punchInTime[1]);
                                        startKioskTime = punchInTime[1];
                                        var InTime = punchInTime[1];
                                    }
                                }
                                else {
                                    punchInButton.setEnabled(false);
                                    punchInButton.setType("Success");

                                    startTime.setValue(punchInTime[1]);
                                    startKioskTime = punchInTime[1];
                                    var InTime = punchInTime[1];
                                }

                                var AppName = "ESG"
                                var Date = formattedDate;
                                var EmployeeID = oView.byId("empId").getValue();
                                var EmployeeName = oView.byId("empName").getValue();
                                var ccFullText = oEvent.getSource().getParent().getCells()[0].getValue();
                                var sepFlag = ccFullText.includes("-");
                                if (sepFlag === true) {
                                    var ccSepIndex = ccFullText.lastIndexOf("-");
                                    var CostCenter = ccFullText.slice(ccSepIndex + 1);
                                }
                                else {
                                    var CostCenter = ccFullText;
                                }
                                var Position = oView.byId("position").getValue();
                                var PositionManager = oView.byId("posman").getValue();
                                var SaveSubmitStatus = "Saved";

                                empDataPush.AppName = AppName;
                                empDataPush.Date = Date;
                                empDataPush.EmployeeID = EmployeeID;
                                empDataPush.EmployeeName = EmployeeName;
                                empDataPush.CostCenter = CostCenter;
                                empDataPush.InTime = InTime;
                                empDataPush.ActualInOutHrs = startKioskTime;
                                empDataPush.Position = Position;
                                empDataPush.PositionManagerName = PositionManager;
                                empDataPush.PositionManagerEmail = PositionManagerEmail;
                                empDataPush.ManagerApprovalName = PositionManager;
                                empDataPush.ManagerApprovalEmail = PositionManagerEmail;
                                empDataPush.PersonnelSubArea = PersonnelSubArea;
                                empDataPush.SaveSubmitStatus = SaveSubmitStatus;
                                empDataPush.PlannedStartTime = plannedStartTimeInSec;
                                empDataPush.CompanyID = companyCode;
                                empDataPush.CompanyName = companyName;
                                empDataPush.PayPeriodBeginDate = payPeriodStartDate;
                                empDataPush.PayPeriodEndDate = payPeriodEndDate;
                                empDataPush.OtThreshold = Ot_Threshold;
                                empDataPush.OtFrequency = Ot_Frequency;
                                empDataPush.LocationCode = LocationCode;
                                empDataPush.PayCode = "";

                                oModel.create("/TimeSheetDetails_prd",
                                    empDataPush,
                                    {
                                        success: function (odata) {
                                            console.log("Post Success");
                                            sap.m.MessageToast.show("Punch In Success", {
                                                duration: 3000
                                            });
                                            setTimeout(function () {
                                                that.clearData();
                                            }.bind(that), 4000);

                                        },
                                        error: function (oError) {
                                            console.log("Post Fail");
                                            console.log(oError);
                                            var msg = "Error Occured";
                                            sap.m.MessageBox.show(msg, {
                                                icon: sap.m.MessageBox.Icon.ERROR,
                                                title: "Error"
                                            });
                                        }
                                    });


                                console.log(tempdata);
                            }

                        },
                        error: function (oError) {
                            console.log(oError);
                        }
                    });
                }
            },
            punchOutTime: function (oEvent) {

                var that = this;
                var oView = this.getView();

                var oModel2 = this.getOwnerComponent().getModel();
                var oModel3 = this.getOwnerComponent().getModel();
                var osaveModel = this.getOwnerComponent().getModel();

                var timeSheetFilter = [];

                var headerDate = oView.byId("idDatePicker").getValue();
                var AppName = new sap.ui.model.Filter('AppName', 'EQ', 'ESG');
                timeSheetFilter.push(AppName);

                // var Date = new sap.ui.model.Filter('Date', 'EQ', headerDate);
                var Date = new sap.ui.model.Filter('Date', 'EQ', formattedDate);
                timeSheetFilter.push(Date);

                var EmployeeID = oView.byId("empId").getValue();
                var EmpId = new sap.ui.model.Filter('EmployeeID', 'EQ', EmployeeID);
                timeSheetFilter.push(EmpId);

                oModel2.read("/TimeSheetDetails_prd", {
                    filters: timeSheetFilter,
                    success: function (oData) {
                        console.log("Time Success");
                        var timeData = oData.results;
                        timeData.sort((a, b) => {
                            if (a.InTime < b.InTime)
                                return -1;
                            if (a.InTime < b.InTime)
                                return 1;
                            return 0;
                        });

                        var lastIndex = timeData.length - 1;

                        startKioskTime = timeData[lastIndex].ActualInOutHrs;
                        var punchOutTime = that.getCurrentTime();
                        var punchOutButton = oEvent.getSource().getParent().getCells()[3];
                        var finishTime = oEvent.getSource().getParent().getCells()[4];
                        var hours = oEvent.getSource().getParent().getCells()[5];
                        punchOutButton.setEnabled(false);
                        punchOutButton.setType("Success");
                        finishTime.setValue(punchOutTime[1]);
                        var dispHours = punchOutTime[2] + " " + "Hrs";
                        hours.setValue(dispHours);

                        var tothrs = oView.byId("totHours").getText().split(" ");
                        var newtothrs = that.addTimes(punchOutTime[2], tothrs[0]);
                        oView.byId("totHours").setText(newtothrs + " Hrs");


                        var out = punchOutTime[1];
                        var actual = punchOutTime[2];
                        var totHours = punchOutTime[2].replace(":", ".");

                        timeData[lastIndex].Date = formattedDate;
                        var d = formattedDate;
                        // (ID="+payload.ID+",AppName='"+payload.AppName+"',Date='"+todayDate+"')"
                        oModel3.update("/TimeSheetDetails_prd(ID=" + timeData[lastIndex].ID + ",AppName='" + timeData[lastIndex].AppName + "',Date='" + d + "')",
                            {
                                OutTime: out,
                                ActualInOutHrs: actual,
                                SaveSubmitStatus: "Submitted",
                                TotalHours: totHours
                            },
                            {
                                method: "PATCH",
                                success: function (odata) {
                                    console.log("Update !!");
                                    sap.m.MessageToast.show("Punch Out Success", {
                                        duration: 4000
                                    });

                                    var oParams = {
                                        EmployeeID: EmployeeID,
                                        PayPeriodBeginDate: payPeriodStartDate,
                                        PayPeriodEndDate: payPeriodEndDate,
                                        AppName: 'ESG',
                                        OtFrequency: Ot_Frequency,
                                        Date: d
                                    };
                                    osaveModel.callFunction("/RTOTCalulation", {
                                        urlParameters: oParams,
                                        method: "GET",
                                        success: function (oData, oResponse) {
                                            var data = oData;
                                            console.log("RT OT Done");
                                        }.bind(this),
                                        error: function (oError) {
                                            // MessageToast.show("No data");
                                            console.log("No data");
                                        }
                                    });

                                    setTimeout(function () {
                                        this.clearData();
                                    }.bind(that), 6000);
                                },
                                error: function (oError) {
                                    console.log("Update Failed !!");
                                    console.log(oError);
                                    var msg = "Error Occured";
                                    sap.m.MessageBox.show(msg, {
                                        icon: sap.m.MessageBox.Icon.ERROR,
                                        title: "Error"
                                    });
                                }
                            });
                    },
                    error: function (oError) {
                        console.log("Time Failure");
                    }
                });

            },

            getCurrentTime: function () {

                let date = new Date();
                var time = [];
                let dispHours = date.getHours();
                let dispMinutes = date.getMinutes();
                let calcHours = date.getHours();
                let calcMinutes = date.getMinutes();
                // Check whether AM or PM
                let newformat = dispHours >= 12 ? 'PM' : 'AM';
                // Find current hour in AM-PM Format
                dispHours = dispHours % 12;
                // To display "0" as "12"
                dispHours = dispHours ? dispHours : 12;
                dispMinutes = dispMinutes < 10 ? '0' + dispMinutes : dispMinutes;
                time[0] = dispHours + ':' + dispMinutes + ' ' + newformat;

                calcMinutes = calcMinutes < 10 ? '0' + calcMinutes : calcMinutes;
                time[1] = calcHours + ':' + calcMinutes;

                if (startKioskTime != undefined) {
                    startKioskTime = startKioskTime.toString();
                    finishKioskTime = time[1].toString();
                    // var calculatedHour = this.in_out_HoursCalc(startKioskTime, finishKioskTime);
                    var calculatedHour = this.subTimes(finishKioskTime, startKioskTime);
                    time[2] = calculatedHour;
                }

                return time;
            },

            // remove ':' and convert it into an integer
            removeColon: function (s) {
                if (s.length == 4)
                    s = s.replace(":", "");

                if (s.length == 5)
                    s = s.replace(":", "");

                return parseInt(s);
            },

            // Main function which finds difference
            in_out_HoursCalc: function (s1, s2) {
                var res;
                var hour1 = s1.split(":");
                var hour2 = s2.split(":");

                if (hour1[0] === hour2[0]) {
                    var minutes = parseInt(hour2[1] - hour1[1]);
                    minutes = minutes.toString();
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    res = "00" + ':' + minutes;
                    return res;
                }
                else {
                    // change string (eg. 2:21 --> 221, 00:23 --> 23)
                    var time1 = this.removeColon(s1);

                    var time2 = this.removeColon(s2);


                    // difference between hours
                    var hourDiff = parseInt(time2 / 100 - time1 / 100 - 1);

                    // difference between minutes
                    var minDiff = parseInt(time2 % 100 + (60 - time1 % 100));

                    if (minDiff >= 60) {
                        hourDiff++;
                        minDiff = minDiff - 60;
                    }

                    // convert answer again in string with ':'
                    res = (hourDiff).toString() + ':' + (minDiff).toString();
                    return res;
                }
            },

            clearData: function () {
                // //Header
                // var oView = this.getView();
                // oView.byId("empId").setValue(" ");
                // oView.byId("empName").setValue(" ");
                // oView.byId("posman").setValue(" ");
                // oView.byId("position").setValue(" ");
                // oView.byId("costCenter").setValue(" ");
                // //Table
                // var oTable = oView.byId("workDetailTab").getItems()[0];
                // oTable.getCells()[0].setEnabled(true);
                // oTable.getCells()[0].setType("Critical");
                // oTable.getCells()[1].setValue(" ");
                // oTable.getCells()[2].setEnabled(true);
                // oTable.getCells()[2].setType("Critical");
                // oTable.getCells()[3].setValue(" ");
                // oTable.getCells()[4].setValue(" ");

                location.reload();
            },

            //Cost Center Value Help Fragment Call Methods
            // name: "com.mgc.esgkiosk.esgkioskui.fragment.ccValueHelp",
            ccHelp: function (oEvent) {
                col = oEvent.getParameters().id;

                if (!this._oDialog) {
                    Fragment.load({
                        name: "com.mgc.esgdriverkioskprd.esgkioskuiprd.fragment.ccValueHelp",
                        controller: this,
                    }).then(function (oDialog) {
                        this._oDialog = oDialog;
                        this.getView().addDependent(oDialog);
                        this._oDialog.open();
                    }.bind(this));
                } else {
                    this._oDialog.open();
                }
            },
            ccDialogOk: function (oEvent) {
                var jobTable = sap.ui.getCore().byId("ccValueHelpTable").getSelectedItem();
                var ccSelectedData = jobTable.getBindingContext().getObject();
                var oInput = sap.ui.getCore().byId(col);
                oInput.setValue(ccSelectedData.costcenterExternalObjectID);
                this._oDialog.close();
            },
            ccDialogClose: function (oEvent) {
                this._oDialog.close();
            },

            //Total Hours Calculation Methods
            // Convert a time in hh:mm format to minutes
            timeToMins: function (time) {
                var b = time.split(':');
                return b[0] * 60 + +b[1];
            },
            // Convert minutes to a time in format hh:mm
            // Returned value is in range 00  to 24 hrs
            timeFromMins: function (mins) {
                function z(n) { return (n < 10 ? '0' : '') + n; }
                var h = (mins / 60 | 0) % 24;
                var m = mins % 60;
                return z(h) + ':' + z(m);
            },
            // Add two times in hh:mm format
            addTimes: function (t0, t1) {
                return this.timeFromMins(this.timeToMins(t0) + this.timeToMins(t1));
            },
            // Sub two times in hh:mm format
            subTimes: function (t0, t1) {
                return this.timeFromMins(this.timeToMins(t0) - this.timeToMins(t1));
            },

            _costcenterHandleValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var aContexts = oEvent.getParameter("selectedContexts");
                if (oSelectedItem) {
                    var oInput = sap.ui.getCore().byId(col);
                    // oInput.setValue(aContexts[0].getObject().costcenterExternalObjectID + "-" + aContexts[0].getObject().description);
                    oInput.setValue(aContexts[0].getObject().description + "-" + aContexts[0].getObject().costcenterExternalObjectID);
                }
            },
            onCostCenterSearchValue: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("costcenterExternalObjectID", FilterOperator.Contains, sValue);
                var oFilter1 = new Filter("description", FilterOperator.Contains, sValue);
                var mfilters = new Filter([oFilter, oFilter1]);
                oEvent.getParameter("itemsBinding").filter(mfilters, sap.ui.model.FilterType.Control);
            },

            onCancel: function (oEvent) {
                location.reload();
            },
            // Returns Total Hours from the Seconds
            get_Hours_From_Seconds: function (tims) {
                let toth = 0,
                    totm = 0,
                    toth_txt = "",
                    tot;
                if (tims > 0) {
                    toth = Math.floor((tims / 3600000));
                    if (toth == "1") {
                        toth_txt = ":";
                    } else {
                        toth_txt = ":";
                    }

                    if (tims > (toth * 3600000)) {
                        totm = Math.floor(((tims - (toth * 3600000)) / 60));
                        if (totm == "1") {
                            tot = toth + toth_txt + totm + "";
                        }
                        else if (totm == "0") {
                            tot = toth + toth_txt + "00"
                        }
                        else {
                            if (totm.toString().length > 2) {
                                totm = totm.toString().substring(0, 2)
                            }
                            tot = toth + toth_txt + totm + "";
                        }
                    }
                    else {
                        tot = toth + ":00";
                    }
                } else {
                    tot = "00";
                }
                return tot;
            },

            GetClock: function () {

                var tday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
                var tmonth = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
                var d = new Date();
                var nday = d.getDay(),
                    nmonth = d.getMonth(),
                    ndate = d.getDate(),
                    nyear = d.getYear(),
                    nhour = d.getHours(),
                    nmin = d.getMinutes(),
                    nsec = d.getSeconds(),
                    ap;
                if (nhour === 0) {
                    ap = " AM";
                    nhour = 12;
                } else if (nhour < 12) {
                    ap = " AM";
                } else if (nhour == 12) {
                    ap = " PM";
                } else if (nhour > 12) {
                    ap = " PM";
                    nhour -= 12;
                }
                if (nyear < 1000) nyear += 1900;
                if (nmin <= 9) nmin = "0" + nmin;
                if (nsec <= 9) nsec = "0" + nsec;
                // var result = "" + tday[nday] + ", " + tmonth[nmonth] + " " + ndate + ", " + nyear + " " + nhour + ":" + nmin + ":" + nsec + ap + "";
                var result = " " + nhour + ":" + nmin + ":" + nsec + ap + "";
                return result;
            }

        });
    });
