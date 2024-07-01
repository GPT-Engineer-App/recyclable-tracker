package com.example.objectdetection;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import org.opencv.android.CameraBridgeViewBase;
import org.opencv.android.OpenCVLoader;
import org.opencv.core.Mat;
import org.opencv.core.Rect;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.imgproc.Imgproc;
import org.pytorch.IValue;
import org.pytorch.Module;
import org.pytorch.Tensor;
import org.pytorch.torchvision.TensorImageUtils;
import org.pytorch.torchvision.TensorImageUtils;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity implements CameraBridgeViewBase.CvCameraViewListener2 {

    private static final String TAG = "MainActivity";
    private static final int CAMERA_PERMISSION_REQUEST_CODE = 200;

    private CameraBridgeViewBase mOpenCvCameraView;
    private Module mModule;
    private TextView mTextView;

    static {
        if (!OpenCVLoader.initDebug()) {
            Log.d(TAG, "OpenCV not loaded");
        } else {
            Log.d(TAG, "OpenCV loaded");
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mOpenCvCameraView = findViewById(R.id.camera_view);
        mOpenCvCameraView.setVisibility(SurfaceView.VISIBLE);
        mOpenCvCameraView.setCvCameraViewListener(this);

        mTextView = findViewById(R.id.text_view);

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA}, CAMERA_PERMISSION_REQUEST_CODE);
        } else {
            mOpenCvCameraView.enableView();
        }

        try {
            mModule = Module.load(assetFilePath("yolov5s.torchscript.pt"));
        } catch (IOException e) {
            Log.e(TAG, "Error loading model", e);
        }
    }

    @Override
    public void onCameraViewStarted(int width, int height) {
    }

    @Override
    public void onCameraViewStopped() {
    }

    @Override
    public Mat onCameraFrame(CameraBridgeViewBase.CvCameraViewFrame inputFrame) {
        Mat frame = inputFrame.rgba();
        Mat resizedFrame = new Mat();
        Imgproc.resize(frame, resizedFrame, new Size(640, 640));

        Tensor inputTensor = TensorImageUtils.bitmapToFloat32Tensor(resizedFrame, TensorImageUtils.TORCHVISION_NORM_MEAN_RGB, TensorImageUtils.TORCHVISION_NORM_STD_RGB);
        Tensor outputTensor = mModule.forward(IValue.from(inputTensor)).toTensor();

        float[] scores = outputTensor.getDataAsFloatArray();
        List<Rect> boxes = new ArrayList<>();
        for (int i = 0; i < scores.length / 6; i++) {
            float score = scores[i * 6 + 4];
            if (score > 0.5) {
                int x = (int) (scores[i * 6] * frame.cols());
                int y = (int) (scores[i * 6 + 1] * frame.rows());
                int w = (int) (scores[i * 6 + 2] * frame.cols());
                int h = (int) (scores[i * 6 + 3] * frame.rows());
                boxes.add(new Rect(x, y, w, h));
            }
        }

        for (Rect box : boxes) {
            Imgproc.rectangle(frame, box.tl(), box.br(), new Scalar(0, 255, 0), 2);
        }

        return frame;
    }

    private String assetFilePath(String assetName) throws IOException {
        File file = new File(getFilesDir(), assetName);
        if (file.exists() && file.length() > 0) {
            return file.getAbsolutePath();
        }

        try (InputStream is = getAssets().open(assetName);
             FileOutputStream os = new FileOutputStream(file)) {
            byte[] buffer = new byte[4 * 1024];
            int read;
            while ((read = is.read(buffer)) != -1) {
                os.write(buffer, 0, read);
            }
            os.flush();
        }
        return file.getAbsolutePath();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == CAMERA_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                mOpenCvCameraView.enableView();
            } else {
                // Permission denied
            }
        }
    }
}