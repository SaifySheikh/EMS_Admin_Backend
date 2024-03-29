let arrow = document.querySelectorAll(".arrow");
  for (var i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", (e)=>{
   let arrowParent = e.target.parentElement.parentElement;
   arrowParent.classList.toggle("showMenu");
    });
  }
  let sidebar = document.querySelector(".sidebar");
  let sidebarBtn = document.querySelector(".bx-menu");
  console.log(sidebarBtn);
  sidebarBtn.addEventListener("click", ()=>{
    sidebar.classList.toggle("close");
  });


  function getCurrentDate() {
    const now = new Date();
    const options = { day: 'numeric', month: 'short' };
    return now.toLocaleDateString('en-US', options);
}


document.getElementById('currentDate').innerText = getCurrentDate();


document.addEventListener("DOMContentLoaded", async () => {
  try {
      const response = await fetch("/admin_data");
      const admins = await response.json();

      const tableBody = document.getElementById("adminTableBody");

      admins.forEach(admin => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${admin.name}</td>
              <td>${admin.hiredCandidates}</td>
              <td>${admin.activeCandidates}</td>
              <td>${admin.month}</td>
              <td><button class="detailButton" onclick="showDetails('${admin.name}')">Detail</button></td>
          `;
          tableBody.appendChild(row);
      });

      // Handle month selection change
      const monthSelector = document.getElementById("month");
      monthSelector.addEventListener("change", () => {
          const selectedMonth = monthSelector.value.toLowerCase();

          // Loop through the rows and show/hide based on the selected month
          const rows = tableBody.querySelectorAll("tr");
          rows.forEach(row => {
              const rowMonth = row.querySelector("td:nth-child(4)").textContent.toLowerCase();
              row.style.display = rowMonth === selectedMonth ? "" : "none";
          });
      });

  } catch (error) {
      console.error(error);
  }
});

function showDetails(recruiterName) {
  console.log("Recruiter Name:", recruiterName);

  // Set the recruiter name in the admin_to_recruiter-details.html file
  const adminNameElement = document.getElementById("admin-name");

  // Check if the element is found before setting textContent
  if (adminNameElement) {
      console.log('if ke andar')
      adminNameElement.textContent = recruiterName;

      // Redirect to the admin_to_recruiter-details.html page
      window.location.href = `/admin_to_recruiter-details.html?name=${recruiterName}`;

  } else {
      console.log('else ke andar')
      console.error("Element with ID 'admin-name' not found.");
  }
}
