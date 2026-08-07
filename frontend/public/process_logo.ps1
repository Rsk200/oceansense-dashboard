Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\Yaad\Downloads\CV\Grocery\ulab.png"
$destPath = "C:\Users\Yaad\Documents\Freshup Oceansense\Oceansense project\Occeansense\oceansense\frontend\public\ulab-dark.png"

$bmp = [System.Drawing.Bitmap]::FromFile($sourcePath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $pixel = $bmp.GetPixel($x, $y)
        
        # If pixel is near white (background) -> make transparent
        if ($pixel.R -gt 230 -and $pixel.G -gt 230 -and $pixel.B -gt 230) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        }
        # If pixel is near black (text) -> make white
        elseif ($pixel.R -lt 100 -and $pixel.G -lt 100 -and $pixel.B -lt 100) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($pixel.A, 255, 255, 255))
        }
        # Otherwise, keep original color (e.g., the blue shield)
        else {
            $newBmp.SetPixel($x, $y, $pixel)
        }
    }
}

$newBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Output "Image processed successfully!"
