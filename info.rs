use crate::lib::s3::BucketInformation;

/// # Arguments
///
/// * `url`: Pre-signed Minio URL
///
/// returns: Result<String, String>
///
/// # Examples
///
/// ```
///  get_id_from_minio_url("http://[HOST]:[PORT]/bucket/file?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=FRT5VH0rZgLrkerIsvPX%2F20240408%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240408T180522Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=9996b702922f65f258019b313fdbce2600d2c0ed13b03a989e5d6c77e21c02af".to_string());
/// ```
pub(crate) fn from_url(url: &str) -> Result<BucketInformation, String> {
    // split the url by /
    let split_url = url.split("/").collect::<Vec<_>>();

    if split_url.len() < 5 {
        return Err("Invalid URL".to_string());
    }

    // get the first element
    let file_name_with_params = split_url[4];

    let file_name = file_name_with_params.split("?").collect::<Vec<_>>()[0];

    let file_name = file_name
        .replace("%2525252525255B", "[")
        .replace("%2525252525255D", "]")
        .replace("%2525252525255b", "[")
        .replace("%2525252525255d", "]");

    let id = file_name.split(".").collect::<Vec<_>>();

    {
        // Future=proof by checking that the filename contains an extension (.gif, .mp4, .jpg, .png, .jpeg)
        let file_name_contains_extension = id.len() > 1;

        if !file_name_contains_extension {
            return Err("Missing extension".to_string());
        }
    }

    let info = BucketInformation {
        bucket_name: split_url[3].to_string(),
        object_name: file_name.to_string(),
        file_extension: id[1].to_string(),
        id: file_name.split(".").collect::<Vec<_>>()[0].to_string(),
    };

    Ok(info)
}



#[cfg(test)]
mod tests {
    use super::*;


    #[test]
    fn test_get_id_from_minio_url() {

        let mut samples: Vec<(String, BucketInformation)> = Vec::new();


        let _url_1 = "https://minio:9000/rtsp/2021-09-14/1631628000.mp4?X-Amz-Algorithm=AWS4-HMAC".to_string();
        let _expected_1 = BucketInformation {
            bucket_name: "rtsp".to_string(),
            object_name: "1631628000.mp4".to_string(),
            file_extension: "mp4".to_string(),
            id: "1631628000".to_string(),
        };

        let url_2 = "https://minio:9000/48f71fe3-5497-45a0-abe2-6c6f1c730b81/473132999538376706.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=A3B57T0MXZLG9LQZ2Z12%2F20240220%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240220T230833Z&X-Amz-Expires=43200&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJBM0I1N1QwTVhaTEc5TFFaMloxMiIsImV4cCI6MTcwODQ4ODU2OCwicGFyZW50Ijoicm9vdCJ9.LVZ9h5IcLgT4-uSLQvM9FmYqBHH7GJKum-3EBaLVdKJCm15xbhiXOL9We9SnjKXfJ8ZJidOUBmZfTENAhq8o_A&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=87ccd15be33052fa91e62e8a675801730acbcdb8791a122df9f8a8d7f7396a4e";
        let expected_2 = BucketInformation {
            bucket_name: "48f71fe3-5497-45a0-abe2-6c6f1c730b81".to_string(),
            object_name: "473132999538376706.mp4".to_string(),
            file_extension: "mp4".to_string(),
            id: "473132999538376706".to_string(),
        };

        // samples.push((url_1, expected_1));
        samples.push((url_2.to_string(), expected_2));

        for (url, expected) in samples {
            let result = from_url(&url);
            if !result.is_ok() {
                println!("Error: {:?}", result.unwrap_err());
                assert!(false);
                continue
            }

            let result = result.unwrap();

            assert_eq!(result.bucket_name, expected.bucket_name);
            assert_eq!(result.object_name, expected.object_name);
            assert_eq!(result.file_extension, expected.file_extension);
        }
    }
}