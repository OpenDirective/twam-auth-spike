# Welcome Applicant

Please make an application using this form.

<!-- markdownlint-disable MD033 -->
<style>
  label > input:required::after {
    content: " *";
    color: red;
  }

</style>

<form name="Application" method="POST" data-netlify="true" action="/app-ack">
  <p>
    <label>Your Name:<br/> <input type="text" name="name" required /></label>
  </p>
  <p>
    <label>Your Email:<br/> <input type="email" name="email" required /></label>
  </p>
  <p>
    <label>About yourself / your organisation:<br/> <textarea name="message"   required></textarea></label>
  </p>
  <p>
    <button type="submit">Send</button>
  </p>
</form>
