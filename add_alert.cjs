const fs = require('fs');
let c = fs.readFileSync('src/components/InternalForms.tsx', 'utf8');

c = c.replace(
  "      } catch (err) {\n        console.error(\"Error saving form to Firestore:\", err);\n      }",
  "      } catch (err: any) {\n        console.error(\"Error saving form to Firestore:\", err);\n        alert(\"Error saving form: \" + (err.message || err.toString()));\n      }"
);

// also let's check for "\r\n"
c = c.replace(
  "      } catch (err) {\r\n        console.error(\"Error saving form to Firestore:\", err);\r\n      }",
  "      } catch (err: any) {\r\n        console.error(\"Error saving form to Firestore:\", err);\r\n        alert(\"Error saving form: \" + (err.message || err.toString()));\r\n      }"
);

fs.writeFileSync('src/components/InternalForms.tsx', c);
