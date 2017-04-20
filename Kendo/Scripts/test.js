

function Indexdocument() {

          dataSource = new kendo.data.DataSource({
        transport: {
            read
                : function (options) {
                    $.ajax({
                        url: "/Home/UserList/",
                        dataType: "json",
                        cache:false,
                        success: function (result) {
                            options.success(result);
                        }
                    });
                },
            update: function (options) {
                var str = this.update.valueOf();
                data_post(str,"u");
            },
            destroy: function (options) {
                var str = this.destroy.valueOf();
                data_post(str,"d");
            },
            create: function (options) {
                var str = this.create.valueOf();
                data_post(str,"cr");
            }
        },
        batch: true,
        pageSize:15,
        schema: {
            model: {
                id: "E_NO",
                fields: {
                    E_NO: {
                        type: "number", editable: false
                    },
                    NAME: {
                        type: "string"
                    },
                    JOB_TITLE: {
                       type: "string"
                    },
                    DEPARTMENT: {
                        type: "string"
                    },
                    EMPLOYEE_ANNUAL_SALARY: {
                        type: "number"
                    },
                    SALARY_MINUS_FURLOUGHS: {
                        type: "number"
                    }

                }
            }
        }
    });

    $("#grid").kendoGrid({
        dataSource: dataSource,
        pageable: true,
        height: 550,
       detailInit: detailInit,
        width:"100%",
        selectable:"row",
        toolbar: ["create"],
        sortable: {
            mode: "single",
            allowUnsort: false
        },
        filterable: true,
        columns: [
             { field: "E_NO", title: "EMP No", editable: false, width: "10%" },
             { field: "NAME", title: "EMPLOYEE NAME", width: "15%" },
             { field: "DEPARTMENT", title: "DEPARTMENT" },
              { field: "JOB_TITLE", title: "EMPLOYEE JOB TITLE"},
             { field: "EMPLOYEE_ANNUAL_SALARY", title: "ANNUAL SALARY",  },
             { field: "SALARY_MINUS_FURLOUGHS", title: "SALARY MINUS FURLOUGHS" },
             { command: ["edit", "destroy"], title: "&nbsp;" }
        ],
        editable: "popup"
    });
   
}
function data_post(str,oper) {
    var dataval = {
        FLAG: oper="d"?1:2,
        E_NO: str.arguments[0].data.models[0].E_NO,
        NAME: str.arguments[0].data.models[0].NAME,
        JOB_TITLE: str.arguments[0].data.models[0].JOB_TITLE,
        DEPARTMENT: str.arguments[0].data.models[0].DEPARTMENT,
        EMPLOYEE_ANNUAL_SALARY: str.arguments[0].data.models[0].EMPLOYEE_ANNUAL_SALARY,
        SALARY_MINUS_FURLOUGHS: str.arguments[0].data.models[0].SALARY_MINUS_FURLOUGHS
    }
    $.ajax({
        url: "/Home/Process/",
        dataType: "json",
        data: dataval,
        success: function (data) {
            window.location = "/Home/Index";
            alert: ("SUCCESS")
        },
        error: function () {
            alert('failure');
        },
        type: "POST"
    });
}

function data_post_history(e,str,FL)
{
    var dataval = {
        FLAG: FL,
        E_No: e.data.E_NO,
        Job_Role: str.arguments[0].data.JOB_ROLE,
        Start_Date: [str.arguments[0].data.START_DATE.getFullYear(),
        '-', ('0' + (str.arguments[0].data.START_DATE.getMonth() + 1)).slice(-2),
        '-', ('0' + str.arguments[0].data.START_DATE.getDate()).slice(-2)].join(''),
        End_Date: [str.arguments[0].data.END_DATE.getFullYear(),
        '-', ('0' + (str.arguments[0].data.END_DATE.getMonth() + 1)).slice(-2),
        '-', ('0' + str.arguments[0].data.END_DATE.getDate()).slice(-2)].join(''),
    }
    $.ajax({
        url: "/Home/Process_History/",
        dataType: "json",
        data: dataval,
        success: function (data) {
            window.location = "/Home/Index";
            alert ('Success');
        },
        error:function(){
            alert('failure');
        },
        type: "POST"
    });
}

function detailInit(e) {
   var data= {
       eno: e.data.E_NO
    }
    $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: function (options) {
                    $.ajax({
                        url: "/Home/Emp_History/",
                        data:data,
                        dataType: "json",
                        cache: false,
                        success: function (result) {
                            options.success(result);
                            alert:("Sucess")
                        },
                        error: function () {
                            alert('failure');
                        },
                    });
                },
                update: function (options) {
                    var str = this.update.valueOf();
                    data_post_history(e, str,1);
                },
                create: function (options) {
                    var str = this.create.valueOf();
                    data_post_history(e, str,2);
                },
                destroy: function (options) {
                    var str = this.destroy.valueOf();
                    data_post_history(e, str,3);
                }
                
            },
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            
            pageSize: 10,
            schema: {
                model: {
                    id: "E_No",
                    fields: {
                        E_No: {
                            type: "number"
                        },
                        JOB_ROLE: {
                            type: "string"
                        },
                        START_DATE: {
                            type: "date"
                        },
                        END_DATE: {
                            type: "date"
                        }
                    }
                }
            }
            
        },
        scrollable: false,
        sortable: true,
        pageable: true,
        toolbar: ["create"],
        editable: "popup",
        columns: [
                            { field: "JOB_ROLE" ,title:"Job Role" },
                            { field: "START_DATE", title: "START DATE",format: "{0:MM/dd/yyyy}" },
                            { field: "END_DATE", title: "END DATE", format: "{0:MM/dd/yyyy}" },
                            { command: ["edit", "destroy"], title: "&nbsp;" }
                           
        ]
       
    });
}