
      
    <?php
        
        // Get the image data (Base64 encoded) from the request
        $frontImage = $request->input('frontImage');
        $backImage  = $request->input('backImage');
        

  
        $frontJson = $request->input('frontJsonData');
        $backJson  = $request->input('backJsonData');
  
  
        // Generate a unique file name for the image
        $frontName = 'front'.uniqid() . '.svg'; // You can adjust the file extension based on your requirements
        $backName  = 'back'.uniqid() . '.svg';
            
        // Save the image to storage (assuming 'images' is the directory in the public disk)
        $frontPath = storage_path('app/public/image/') . $frontName;
        $backPath  = storage_path('app/public/image/') . $backName;
    
        
        // Write the decoded image data to the file
        file_put_contents($frontPath, $frontImage);
        file_put_contents($backPath, $backImage);
            
        // Create a new TemplateApi instance
        $templateApi = new TemplateApi();
    
        // Assign the JSON data to the 'object' column/property in your model

        $templateApi->front = $frontJson;
        $templateApi->back = $backJson;
    
        // Assign the image path to the 'image' column/property in your model
        $templateApi->front_img_url = $frontPath;
        $templateApi->back_img_url  = $backPath;
            
                $templateApi->save();
        
   
            
        
        
       
        
    }