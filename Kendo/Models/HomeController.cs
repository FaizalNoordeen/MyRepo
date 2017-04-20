using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Web.Script.Serialization;
using Kendo.Models;
using System.Diagnostics;
using System.Windows.Forms;



namespace Kendo.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home_/

        public ActionResult Index()
        {
            
            return View("Index");
        }
        
        public string UserList()
        {
            DataTable dt = new DataTable();
            dt = Excu_query("Select * from Employee");
            string json = (JSONconvert(dt));
            return json;
        }
        public string Emp_History(int eno)
        {
            DataTable dt = new DataTable();
            dt = Excu_query("SELECT * FROM Employee_History where E_NO="+eno+";");
            string json = (JSONconvert(dt));
            return json;
        }
       public DataTable Excu_query(string cmdstr)
        {
            DataTable ds = new DataTable();
            try
            {
                string constr = WebConfigurationManager.AppSettings["LocalServer"];
           
           SqlConnection con = new SqlConnection(constr);
                    
                con.Open();
            
                SqlCommand cmd = new SqlCommand(cmdstr, con);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                
                da.Fill(ds);
               
            }
           catch(Exception excep)
            {
                MessageBox.Show(excep.Message, "Error!!");
            }
            return ds;
        }

       public string JSONconvert(DataTable table)
       {
           JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
           List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
           Dictionary<string, object> childRow;
           foreach (DataRow row in table.Rows)
           {
               childRow = new Dictionary<string, object>();
               foreach (DataColumn col in table.Columns)
               {
                   childRow.Add(col.ColumnName, row[col]);
               }
               parentRow.Add(childRow);
           }
         return jsSerializer.Serialize(parentRow);
           
       }
        [HttpPost]
        public void Process(int FLAG, int E_NO, string NAME, string JOB_TITLE, string DEPARTMENT, int EMPLOYEE_ANNUAL_SALARY, int SALARY_MINUS_FURLOUGHS)
        {

            try
            {
                DataTable str1;
                string constr = WebConfigurationManager.AppSettings["LocalServer"];
                SqlConnection con = new SqlConnection(constr);
                con.Open();
                string str = "exec PROCESS " + FLAG + "," + E_NO + ",'" + NAME + "','" + JOB_TITLE + "','" + DEPARTMENT + "'," + EMPLOYEE_ANNUAL_SALARY + "," + SALARY_MINUS_FURLOUGHS + ";";
                SqlCommand cmd = new SqlCommand(str, con);
                str1 = Excu_query(str);
                con.Close();
                
            }
            catch(Exception InvalidProcedure)
            {
                MessageBox.Show(InvalidProcedure.Message, "Error!!");
                
            }
         // return "true";
            
        }
        [HttpPost]
        public void Process_History(int FLAG, int E_NO, string Job_Role, string Start_Date, string End_Date)
        {
            try
            {
                string constr = WebConfigurationManager.AppSettings["LocalServer"];
            SqlConnection con = new SqlConnection(constr);
            con.Open();
            string str = "exec Process_History " + FLAG + "," + E_NO + ",'" + Job_Role + "','" + Start_Date + "','" + End_Date + "';";
          
            SqlCommand cmd = new SqlCommand(str, con);
            cmd.ExecuteNonQuery();
            con.Close();
       
            }

            catch(Exception InvalidProcedure)
            {
                throw InvalidProcedure;
                
            }
        }
        }
}
