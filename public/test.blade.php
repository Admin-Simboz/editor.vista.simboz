<?php

namespace App\Http\Controllers;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class TemplateApiController extends Controller
{
    

    public function store(Request $request)
    {
       
      // Retrieve all posts
    return response()->json($request);
   

      }
      
    public function test(Request $request)
    {
       
      // Retrieve all posts
    return response()->json($request);
   

      }

    public function show($id)
    {
    }

    public function update(Request $request, $id)
    {
       

        return response()->json(['message' => 'Post updated successfully']);
    }

    public function destroy($id)
    {
       
        return response()->json(['message' => 'Post deleted successfully']);
    }     
}
